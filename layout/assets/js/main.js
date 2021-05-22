$(document).ready(start);

function gameOverCallback(fSuccess) {
	GameOver = true;
	pause = true;
	jQuery.ajax({
		cache   : false,
		type    : 'POST',
		data    : {'username':NamePlayer,'score':kills,'time':(min*60+sek)},
		url     : '../php/register.php',
		success : fSuccess,
		error   : function() {
			console.error('Error get result!');
		}
	});
}

function animinstruction(){ // Функция для анимации текста
	black = -20; //Начальное значение для черной части текста
	red = 10; //Начальное значение для красной части текста, которая бегает по черной вверх и вниз
	logic = true; // Проверка для переливания градиента, вверх или вниз
	setInterval(function(){ //Вызов анимации с периодичностью в 100мс
		$('#instruction').css({
			'background'  : 'linear-gradient(180deg, black ' + 
				black + '%, red ' + red + '%, black ' + red + '%',
			'-webkit-background-clip' : 'text',
			'-webkit-text-fill-color' : 'transparent'
		}); // Динамическое именение базовых css свойств
		if(black >= 70) logic = false; //Если дошли до конца текста снимаем флаг
		else if (black <= -20 ) logic = true; //Если дошли до начала текста ставим флаг
		if(logic){ //Если флаг стоит то изменям значение свойств в большую сторону 
			black++;
			red++;
		}
		else{	//Если флаг не стоит то изменям значение свойств в меньшую сторону 
			black--;
			red--;
		}
	},100)

}

function listener(){
	document.getElementById('play').value = 'Next!';		//Создаем функцию, вызов которой осуществляется при изменении input для ввода имени
	NamePlayer = $(this).val();  //Сохраняем имя введенное игроком
	NamePlayer=NamePlayer.replace(/\s+/g,''); //Удаляем пробелы  в имени
	if((/^[\wА-Я][\d\w\._\-А-Я]{2,11}$/i).test(NamePlayer) == false){// Иначе Задаем ей свойства активной кнопки
		$('#play').css({'color'       : 'grey', 
			'border-color': 'grey', 
			'background'  : 'linear-gradient(black, grey)',
			'border': '0px solid black'
		})[0].disabled = true;
		return false;
	}
	
	jQuery.ajax({
		cache   : false,
		type    : 'POST',
		data    : {'username':NamePlayer},
		url     : '../php/check.php',
		success : function(data) {
			data = JSON.parse(data);
			if(data.exists != 0) {
				document.getElementById('play').value = 'Ник занят';
				$('#play').css({'color'       : 'grey', 
					'border-color': 'grey', 
					'background'  : 'linear-gradient(black, grey)',
					'border': '0px solid black'
				})[0].disabled = true;
				return false;
			}
			$('#play').css({'color': 'white', 
					'border-color': 'red', 
					'background'  : 'linear-gradient(red, black)',
					'border': '0px solid red'
			})[0].disabled = false;
		},
		error   : function() {
			console.error('Error get result 2!');
		}
	});
}

function CheckPause(){
	$(document).keyup(function (e) { //Если нажата клавиша
		if(e.which == 27 && !GameOver){ //Если клавиша Esc(код клавиши 27) и игра не завершена
			pause = !pause; //изменяем переменную pause на противоположное текущему значению true->false, false->true
			if(pause) //Если пауза активна
				$('body').append("<div class='pause screen panel' style='width:10%;height:10%; display:flex; align-items:center; justify-content:center;'><h1>Pause</h1></div>"); //генерируем новый div с текстом о паузе посередине экрана
			else //Если пауза не активна
				$('.pause').remove(); //Удалить уведомление об активности паузы
		}
	});
}

function timer(){ //Функция таймера
	setInterval(function(){ //Изменение минут и секунд с интервалом в секунду
		if(pause){
			return;
		}

		if(thirdotkat > 0){	// 3 атака
			$('#skill-sword-3').css('display' , 'block');
			$('#skill-sword-3').text(thirdotkat);	
			thirdotkat-=1;
		} else {
			$('#skill-sword-3').css('display' , 'none');
		}

		if(fourthotkat > 0){// 4 атака
			$('#skill-sword-8').css('display' , 'block');
			$('#skill-sword-8').text(fourthotkat);			
			fourthotkat-=1;
		} else  {
			$('#skill-sword-8').css('display' , 'none');
		}

		if (mana < 96) { 
			$('.panel-mp .score-value span').text(mana+=5);
			$('.panel-mp .score-value').animate({'width' : '+=4%'},200);
		}
		
		if (hp < 99) {
			$('.panel-xp .score-value span').text(hp+=2);
			$('.panel-xp .score-value').animate({'width' : '+=2%'},200);
		}

		sek++; //Увеличение переменной каждую секунду
		if (sek > 59) { // Если количество секунд больше 59 то 
			min++;  //Увеличивает кол-во минут
			sek = 0; //Обнуляет секунды
		}

		$('.timer').text( 
		'Time: ' + (min < 10 ? ('0' + min) : min) + ':' + (sek < 10 ? ('0' + sek) : sek)
		); //Вывод на экран значений таймера
	
		
	},1000);
} 


function start(){
	$('#inputname').val('');
	$('#play').css({'color'       : 'grey', 
		'border-color': 'grey', 
		'background'  : 'linear-gradient(black, grey)',
		'border': '0px solid black'
	})[0].disabled = true;	
	NamePlayer = ""; // Переменная для хранения имени игрока
	sek = 0; 
	min = 0; 
	first = true;
	second = true;
	third = true;
	thirdotkat = 0;
	dir = 1; //Если 1 то смотрит в право, если 0 то в лево
	fourth = true;
	fourthotkat = 0;
	mana = 100;
	hp = 100;

	walk = false; //Проверка на то, что персонаж идет
	kills = 0; //переменная для хранения кол-ва убитых зомби
	Zombies = [ //Двумерный массив, для хранения свойств зомби 
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0],
			[15, true, 2, false, 0, 0]
		];/*0 - хп, 1 - проверка: живой или мертвый, 2 - урон, 5 - id интервала, который отвечает за
		все действия зомби,  4 - разница между координатами положения зомби и тролля, 3 - атаккует или нет*/
	ZR = []; // Массив для хранения id убитых зомби
	pause = false; // переменная для проверки стоит игра на паузе или нет
	GameOver = false; //переменная для проверки закончена игра или нет

    animinstruction(); 
   

	$('#inputname')[0].addEventListener('input', listener);
    
    $('#play').click(function(){ //событиые при нажатии на кнопку
        $('.screen-start').css('display', 'none'); //Отключение стартового меню
        $('.screen-ranking').css('display', 'none');  //Отключение окна рейтинга
        $('.user-info').text(NamePlayer); //Отображение введенного имени пользователем
        $('.panel-mp').css('background' , 'none'); //Отключение белого фона для GUI HP
        $('.panel-xp').css('background' , 'none'); //Отключение белого фона для GUI MP
        timer();
		$('#play').css('display' , 'none');
        $('#TROLL').css('display' , 'block');
		ControlTroll();
		ControlZombie(-1);///////////////////////////
		ZombieRevive();//////////
		CheckPause();
	});
	

    
    //учим ходить троля
    function ControlTroll(){
		$(document).keydown(function (e) {
		if(!pause){ 
			if(e.which == 53){
				gameOverCallback(function(data) {
					data = JSON.parse(data);
					
					/* data.sort(function(a, b){
						return b.score-a.score;
					}); */
					
					for(j = 0; j < (data.length); j++){
						for(i = 0; i < data.length-1-j; i++){
							if(parseInt(data[i].score)==parseInt(data[i+1].score) && 
								parseInt(data[i].time)>parseInt(data[i+1].time)){
									elem = data[i];
									data[i] = data[i+1];
									data[i+1] = elem;
							}
						}
					}
					checkuser = false;
					for(i = 0; i < 10 && i < data.length; i++){
						if(data[i].username==NamePlayer && data[i].score==kills && data[i].time==min+sek)
							checkuser = true;
					}
					position = 1;
					if(!checkuser) {
						for(i = 1; i < data.length; i++){
							if(data[i].username==NamePlayer && data[i].score==kills && data[i].time==min+sek){
								break;
							}
							if(data[i].score!=data[i-1].score || 
								data[i].time!=data[i-1].time)
								++position;
						}
						data[9].username=NamePlayer; 
						data[9].score=kills;
						data[9].time=min+sek;
					}
					$('table *').each(function(td){
						$(this).remove();
					});
					$('table').append('<tr><td>#</td><td>Username</td><td>Killed mosters</td><td>Time</td></tr>');

					number = 1;
					for(i = 0; i < (data.length<=10?data.length:10); i++){
						if(i == 9 && !checkuser) number = (position-1);
						
						if(i == 0)
							$('table').append('<tr><td>'+number+'</td>'+
												'<td>'+data[i].username+'</td>'+
												'<td>'+data[i].score+'</td>'+
												'<td>'+data[i].time+'</td></tr>'); 
						else{
							logic = data[i].score==data[i-1].score && data[i].time==data[i-1].time;
							$('table').append('<tr><td>'+(logic?number:(++number))+'</td>'+
												'<td>'+data[i].username+'</td>'+
												'<td>'+data[i].score+'</td>'+
												'<td>'+data[i].time+'</td></tr>');
						}
					}
					$('.screen-ranking').css('display', 'block');
				});
			}

            if(e.which == 50 && second && mana >=5){//Если нажата кнопка 2 и щит еще не стоит
				$('#TROLL').append('<img id="shild" style = "width:3vw; height:9vw; position:absolute; top:0vw; left:13vw;"src="media/123.png">');//Ставим перед игроком щит
				second = false;//И устанавливаем значение флага на то, что щит установлен
				$('.panel-mp .score-value span').text(mana-=5);
				$('.panel-mp .score-value').css('width' , '-=5%');
			}
			if (e.which == 37 && second) {//Если нажата левая стрелка.Добавляем проверку, что если щит установлен ходить нельзя
                dir=0;
                if(parseInt($('#TROLL').css('left')) > 900)  //Если положение персонажа не середина и он находиться с права
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(-1,1)', 'left' : '-=0.5vw'}); //Изменяем сторону в которую смотрит троль и двигаем его влево
				else if (parseInt($('.screen-game').css('background-position-x')) < 0){ //Если фон не сдвинут до конца влево
					$('.screen-game').css('background-position-x' , '+=0.5vw'); //Двигаем фон вправо
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(-1,1)'});//Изменяем сторону в которую смотрит тролль
				}
				else if(parseInt($('#TROLL').css('left')) > 350) //Если положение персонажа не середина и он находиться с лева
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(-1,1)', 'left' : '-=0.5vw'}); //Изменяем сторону в которую смотрит троль и двигаем его влево
			}
			else if(e.which == 39 && second) { //Если нажата правая стрелка
                dir = 1;
                if(parseInt($('#TROLL').css('left')) < 800)  //Если положение персонажа не середина и он находиться с лева
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(1,1)', 'left' : '+=0.5vw'}); //Изменяем сторону в которую смотрит троль и двигаем его вправо

				else if (parseInt($('.screen-game').css('background-position-x')) > -675){//Если фон не сдвинут до конца вправо
					$('.screen-game').css('background-position-x' , '-=3'); //Двигаем фон влево
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(1,1)'});//Изменяем сторону в которую смотрит тролль
				}
				else if(parseInt($('#TROLL').css('left')) < 1400)//Если положение персонажа не середина и он находиться с права
					$('#TROLL').css({'background' : 'url(media/trolls/gif/troll/IDLE_000.gif)', 
						'backgroundSize' : '100%', 'transform' : 'scale(1,1)', 'left' : '+=0.5vw'});//Изменяем сторону в которую смотрит троль и двигаем его вправо
					
            }//media/trolls/gif/troll/ATTAK_000.gif
            //media/trolls/png/1troll/IDLE/IDLE_000.png)
		}
		}).keyup(function (e) {
		if(!pause){ 
			if(e.which == 37 || e.which == 39 ) {
                $('#TROLL').css({'background' : 'url(media/trolls/png/1troll/IDLE/IDLE_000.png)', 'backgroundSize' : '100%'});
                }		
                if(e.which == 49 && first && second){ //Если нажата единица и удар не идет
                    $('#TROLL').css({'background' : 'url(media/trolls/gif/troll/ATTAK_000.gif)', 
                        'backgroundSize' : '100%', 'width' : '15.5vw', 'height' : '13vw','top' : '-=4.6vw','left' : '-=2vw'}); //Запуск gif с ударом и смещением, ибо картинки разных размеров
                    first = false; //Проверям что удар идет
                    setTimeout(function(){
                        $('#TROLL').css({'background' : 'url(media/trolls/png/1troll/IDLE/IDLE_000.png)', 
                            'backgroundSize' : '100%', 'width' : '13vw', 'height' : '9vw','top' : '+=4.6vw', 'left' : '+=2vw'}); //Возвращаем персонажа после удара в ожидание
                            first = true; //Атака завершена
                    },400); //время на анимацию атаки
                }
                if(e.which == 50){//Если отжата кнопка '2'
				$('#shild').remove();//убираем щит
				second = true;//устанавливаем значение флага, на то что щит убран
                }

                if(e.which == 51 && third && mana >= 10 && thirdotkat == 0){//при нажатии на 3 вылетает трио дубин
                    third = false;
                    idTrio = setTimeout(function(nIndex){
						if(!(nIndex--))
							return;
						var oInsert = document.createElement('img');
						oInsert.id = 'trio'+nIndex;
						oInsert.setAttribute('x-dubina', nIndex);
						$(oInsert).css({
							'width': '8vw',
							'height': '8vw',
							'position': 'absolute',
							'top': $('#TROLL').css('top'),
							'left': $('#TROLL').css('left'),
							'transform': 'rotate(45deg)'
						});
						oInsert.src = 'media/дубина.png';
                        $('body').append(oInsert);
                        $(oInsert).animate({'left' : (dir == 1 ? '+=72vw' : '-=72vw')},1000, function() {
							if(parseInt(this.getAttribute('x-dubina')) == 0)
                                third = true;
							
							thirdotkat = 3;
                            $(this).remove();
                        });
                        setTimeout(arguments.callee, 200, nIndex);
                    }, 200, 3);
                    $('.panel-mp .score-value span').text(mana-=10);
                    $('.panel-mp .score-value').css('width' , '-=10%');
				}
				if(e.which == 52 && fourth && mana >= 30 && fourthotkat == 0){
					fourth = false;
					dubina = 1;
					dubinaTop = 40;
					dubinaLeft = 13;
					for(i = 0; i < 7; i++){
						$('body').append('<img id="fourth'+dubina+'" style = "width:8vw; height:8vw; position:absolute;'+
							'top:'+ $('#TROLL').css('top') +'; left:'+ $('#TROLL').css('left') +';'+
							'transform: rotate('+(dir == 1 ? 100 : 170)+'deg);"src="media/дубина.png">');
						$('#fourth' + dubina).css({'top' : '-='+dubinaTop+'vw', 'left' : '-='+dubinaLeft+'vw'})
						dubinaTop += (i%2 == 0 ? -3 : 3);
						if(dir)dubinaLeft -= (i%2 == 0 ? 6 : 3);
						else dubinaLeft -= (i%2 == 0 ? 3 : 6);
						dubina++;
					}	
					
					for(i = 1; i < 8;i++){
						$('#fourth'+i).animate({'top' : '40vw','left' : '+='+(dir == 1 ? 30 : -30)+'vw'},1000,function(){
							for(i = 1; i < 8;i++){
								if(i == 7) {
									fourth = true;
									fourthotkat = 15;
								}
								$('#fourth'+i).remove();
							}
						}); 
					}
					$('.panel-mp .score-value span').text(mana-=30);
					$('.panel-mp .score-value').animate({'width': '-=30%'},200);
					}
		    }
		})	
	} 
	function ControlZombie(k){
		if(k == -1){
			j = 0;
			id = setInterval(function(){
			if(!pause){///////
				if(j < 10){
					ZombieType = Math.round(Math.random() * (9));
					type = ['1','1','1','1','1','2','2','2','3','3'];
					$('body').append('<div id="Zombie' + j +'" style = "width:6.5vw; height:9vw; position:absolute;'+
					'top:'+ $('#TROLL').css('top') +'; left: 100vw; transform: scale(1,1); background: url(media/zombie/PNG/Zombie'+type[ZombieType]+'/animation/Run1.gif); background-size: cover;">');
					$('#Zombie' + j).append('<div id = "ZombieHPWidth'+j+'" style = "width:5vw; height:0.9vw; position:absolute; top:-1.5vw; left: 1vw; background: green;"><p id="ZombieHP'+j+
					'"style="font-size:1vw; color:white; text-align:center;"></p></div>');	
					ZombieActive(j,type[ZombieType]);
					j++;
				}
				else clearInterval(id);
			}
			},1500);
		}
		else{
			if(!pause){///////
				setTimeout(function(){
					$('#Zombie' + k).remove();
					Zombies[k][0] = 15;
					Zombies[k][1] = true;
					Zombies[k][2] = 2;
					Zombies[k][3] = false;
					Zombies[k][4] = 0;
					Zombies[k][5] = 0;
					ZR.push(k);
					
				},2000);
			}
		}
	}
	function ZombieActive(k,z){
		i = 0;
		if(z==1) {Zombies[k][0] = 15; Zombies[k][2] = 2;}
		if(z==2) {Zombies[k][0] = 30; Zombies[k][2] = 5;}
		if(z==3) {Zombies[k][0] = 60; Zombies[k][2] = 10;}	
		Damage1 = 15;
		Damage2 = 13;
		$('#ZombieHP' + k).text(Zombies[k][0]);
		Zombies[k][5] = setInterval(function(){	
			if(!pause){///////
				i++;
				if(walk && parseInt($('.screen-game').css('background-position-x')) < 0
						&& parseInt($('.screen-game').css('background-position-x')) > -675){
					if(dir == 0){
						$('#Zombie' + k).css('left' , '+=1.5vw');
					}								
					if(dir == 1){
						$('#Zombie' + k).css('left' , '-=1.5vw');	
					}
				}
				Zombies[k][4] = parseInt($('#Zombie' + k).css('left')) - parseInt($('#TROLL').css('left'));
				if(Zombies[k][1]){
					if( Zombies[k][4] < 140 && Zombies[k][4] > -50){
						$('#Zombie' + k).css({'background' : 'url(media/zombie/PNG/Zombie'+z+'/animation/Attack1.gif)', 'background-size' : 'cover'});
						if(i>=5){
							if((hp-=Zombies[k][2]) < 0)/*TODO: Zombies[k][2]*/ 
								hp = 0;
							$('.panel-xp .score-value span').text(hp);
							$('.panel-xp .score-value').animate({'width' : '-='+Zombies[k][2]+'%'},200);
							i = 0;
							if(hp == 0){/////////////////////////////////////////////////
								gameOverCallback();
								$('body').append("<div class='screen panel' style='width:50%;height:50%; text-align:center;'><h1>GameOver</h1><br><h2>Your Killed: "+kills+"<br>Your Time: " + (min < 10 ? ('0' + min) : min) + " : " + (sek < 10 ? ('0' + sek) : sek)+"</h2><br><input type='submit' value='Restart' onclick='location.reload()'></div>");
							};////////////////////////////////////////////////////////////
						}
						
						if(!first)
							Zombies[k][3] = true;
						if(first && Zombies[k][3]){
							$('#ZombieHP' + k).text(Zombies[k][0]-=Damage1);
							$('#ZombieHPWidth' + k).animate({'width' : '-='+Damage1*100/Zombies[k][0]+'%'},200);
							if(Zombies[k][0] < 1) $('#ZombieHPWidth' + k).remove();
							Zombies[k][3] = false;
						}
					}
					else if(!second && dir == 1 && Zombies[k][4] > 220 && Zombies[k][4] < 250)
						$('#Zombie' + k).css({'background' : 'url(media/zombie/PNG/Zombie'+z+'/animation/Idle1.gif)', 'background-size' : 'cover'});
					else if(!second && dir == 0 && Zombies[k][4] > -130 && Zombies[k][4] < 0)
						$('#Zombie' + k).css({'background' : 'url(media/zombie/PNG/Zombie'+z+'/animation/Idle1.gif)', 'background-size' : 'cover'});
					else {
						$('#Zombie' + k).css({'background' : 'url(media/zombie/PNG/Zombie'+z+'/animation/Run1.gif)', 'background-size' : 'cover'});
							if(Zombies[k][4] > 0){			
								$('#Zombie' + k).css('left' , '-=1vw');							
								$('#Zombie' + k).css('transform' , 'scale(-1,1)');
								$('#ZombieHP' + k).css('transform' , 'scale(-1,1)');
							}
							else {		
								$('#Zombie' + k).css('left' , '+=1vw');
								$('#ZombieHP' + k).css('transform' , 'scale(1,1)');
								$('#Zombie' + k).css('transform' , 'scale(1,1)');
							}
					}
					if(!third){
						if(parseInt($('#Zombie' + k).css('left')) <= parseInt($('#trio1').css('left')) + 100){
							$('#ZombieHP' + k).text(Zombies[k][0]-=Damage2);
							$('#ZombieHPWidth' + k).animate({'width' : '-='+Damage2*100/Zombies[k][0]+'%'},200);
						}
					}
					if(!fourth){
						if(parseInt($('#fourth7').css('left')) >= parseInt($('#Zombie' + k).css('left')) &&
						   parseInt($('#fourth1').css('left')) <= parseInt($('#Zombie' + k).css('left')) && 
						   parseInt($('#fourth1').css('top')) >= parseInt($('#Zombie' + k).css('top'))
						)  {
							$('#ZombieHP' + k).text(Zombies[k][0]-=Damage2);
							$('#ZombieHPWidth' + k).animate({'width' : '-='+Damage2*100/Zombies[k][0]+'%'},200);
						}
					}
					if(Zombies[k][0] <= 0) {
						$('#ZombieHPWidth' + k).remove();
						$('#Zombie' + k).css({'background' : 'url(media/zombie/PNG/Zombie'+z+'/animation/death1.gif)', 'width' : '10.5vw','height' : '8.5vw', 'background-size' : 'cover'});	
						kills++;
						$('.kills').text('Killed:' + kills);			
						Zombies[k][1] = false;	
						clearInterval(Zombies[k][5]);
						ControlZombie(k);					
					}
				}
			}
		},125);	
	}

	function ZombieRevive(){
		setInterval(function(){
			if(!pause){///////
				if(ZR.length != 0){
					ZombieType = Math.round(Math.random() * (9));
					type = ['1','1','1','1','1','2','2','2','3','3'];
					$('body').append('<div id="Zombie' + ZR[0] +'" style = "width:6.5vw; height:9vw; position:absolute;'+
					'top:'+ $('#TROLL').css('top') +'; left: 100vw; transform: scale(1,1); background: url(media/zombie/PNG/Zombie' + type[ZombieType] + '/animation/Run1.gif); background-size: cover;">');
					$('#Zombie' + ZR[0]).append('<div id = "ZombieHPWidth'+ZR[0]+'" style = "width:5vw; height:0.9vw; position:absolute; top:-1.5vw; left: 1vw; background: green;"><p id="ZombieHP'+ZR[0]+
					'"style="font-size:1vw; color:white; text-align:center;"></p></div>');	
					ZombieActive(ZR[0],type[ZombieType]);
					ZR.shift();
					for(i = 0; i < ZR.length-1; i++){
						localv = ZR[i];
						ZR[i] = ZR[i+1];
						ZR[i+1] = localv;
					}
				}
			}
		},1500);
	}


  
}
