var t,
    s,
    calendar = {
      
      arrays: {
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        daysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      },
       
      calSettings: {
        NOW: new Date(),
        NOWmonth: '',
        NOWyear: '',
        displayNow: '',
        displayNowTime: '',
        date: '',
        day: '',
        niceDay: '',
        month: '',
        niceMonth: '',
        year: '',
        firstDay: '',
        monthLength: '',
        calHTML: '',
        display: false,
        nextMonth: '',
        nextYear: '',
        displayOffset: 0
      },
      
      divs: {
        body: document.getElementsByTagName("BODY")[0],
        calTitle: document.getElementById('title'),
        calAppend: document.getElementById('append'),
        days: '',
        show: document.getElementById('show'),
        arrows: document.getElementsByClassName('arrow')
      },
      
      init: function() {
        t = this;
        a = t.arrays;
        c = t.calSettings;
        d = t.divs;
        
        // get today's date
        c.displayNow = new Date();
        c.NOWmonth = c.NOW.getMonth();
        c.NOWyear = c.NOW.getFullYear();
        
        // create the calendar
        t.createCal();

        // trigger navCal function
        t.navCal();
      },
      
      createCal: function() {
        // get today's stuff
        c.displayNowTime = c.displayNow.getTime();
        c.date = c.NOW.getDate();
        c.day = c.displayNow.getDay();
        c.month = c.displayNow.getMonth();
        c.year = c.displayNow.getFullYear();
        
        // get the first day of the month
        c.firstDay = new Date(c.year, c.month, 1);
        c.firstDay = c.firstDay.getDay();

        if( c.NOWmonth === c.month && c.NOWyear === c.year ) {
          c.displayOffset = 0;
        } else if( (c.NOWyear === c.year && c.NOWmonth > c.month ) || c.NOWYEAR > c.year ) {
          c.displayOffset = -1;
        } else if( (c.NOWyear === c.year && c.NOWmonth < c.month) || c.NOWyear < c.year ) {
          c.displayOffset = 1;
        }
        
        // get the number of days in this month
        c.monthLength = a.daysInMonths[c.month];
        // leap year
        if ( c.month == 1 ) { // February only!
          if( ( c.year % 4 === 0 && c.year % 100 !== 0 ) || c.year % 40 === 0 ){
            c.monthLength = 29;
          }
        }
        
        // convert the day and month into words
        c.niceDay = a.days[c.day];
        c.niceMonth = a.months[c.month];

        // set title to current month and year
        d.calTitle.innerHTML = c.niceMonth + ' ' + c.year;

        var day = 1;
        c.calHTML = '';

        // create the weeks
        for( var i = 0; i < 9; i++ ) {
          c.calHTML += '<div class="row">';
          
          // create the days
          for( var j = 0; j < 7; j++ ) {
            
            // only add an actual date if it's on or after the first day of the month
            if( day <= c.monthLength && ( i > 0 || j >= c.firstDay ) ) {
              
              if( day === c.date ) {
                c.calHTML += '<div class="item" id="today" data-dow="' + j + '">';
              } else {
                c.calHTML += '<div class="item" data-dow="' + j + '">';
              }
              c.calHTML += '<span class="bg"></span>';
              c.calHTML += '<span class="num">';
              c.calHTML += day;
              day++;
              c.calHTML += '</span>';
              c.calHTML += '</div>';

            } else {
              c.calHTML += '<div class="item hidden-vert">';
              c.calHTML += '<span class="bg"></span>';
              c.calHTML += '<span class="num"></span>';
              c.calHTML += '</div>';
            }

          
          }
          c.calHTML += '</div>';

          // stop looping after the month is done
          if( day > c.monthLength ) {
            break;
          }
        }
        
        // append to the calendar
        d.calAppend.innerHTML = c.calHTML;
        
        // grab all the items in a variable
        // then update the calendar
        // then set interval to update calendar every 15 minutes
        d.days = document.getElementsByClassName('item');
        t.updateCal();
        setInterval(function() {
          t.updateCal();
        }, 60 * 1000 ); // 60 * 1000 milsec
        
      },
      
      updateCal: function() {
        // loop through all the days
        // grab the number and the background divs
        for( var i = 0; i < d.days.length; i++ ) {
          var num = d.days[i].getElementsByClassName('num'),
              bg = d.days[i].getElementsByClassName('bg');
          
          // loop through the number div
          // grab the date and turn into and integer
          for( var n = 0; n < num.length; n++ ) {
            var boxDay = parseInt(num[n].innerHTML);
            
            if( c.displayOffset === 0 ) {
              // if the number div is empty (starting empty divs)
              // assign date as 0
              if( !boxDay ) {
                boxDay = 0;
              }
            }

            // loop through the background div
            for( var b = 0; b < bg.length; b++ ) {

              if( c.displayOffset === 0 ) {
                // if it's before today, set height of bg to 100%
                if( boxDay < c.date ) {
                  bg[b].style.height = '100%';
                // if it's today, add the bg--today class
                // then update the height based on how close to midnight it is
                } else if ( boxDay === c.date ) {
                  bg[b].classList.add('bg--today');
                  bg[b].style.height = t.minutesUntilMidnight() + '%';
                }
              } else if( c.displayOffset === -1 ) {
                bg[b].style.height = '100%';
              }
              
            }
          }
        }

        if( t.minutesUntilMidnight() < 300 || (t.minutesUntilMidnight() > 0 && t.minutesUntilMidnight() < 1140) ) {
          d.body.classList.add('night');
        } else {
          d.body.classList.remove('night');
        }

        // hide loading div after 1.5 seconds
        /*if( !c.display ) {
          setTimeout( function() {
            d.body.classList.add('active');
            d.show.style.display = 'none'; 
          }, 1500 );
          c.display = true;
        }*/
      }, 


      minutesUntilMidnight: function() {
        var midnight = new Date(),
            totalMinutes = 24*60,
            minutesUntil,
            percentLeft,
            percentDone;
        midnight.setHours( 24 );
        midnight.setMinutes( 0 );
        midnight.setSeconds( 0 );
        midnight.setMilliseconds( 0 );
        minutesUntil = midnight.getTime() - new Date().getTime();
        minutesUntil = minutesUntil / 1000 / 60;
        percentLeft = minutesUntil / totalMinutes * 100;
        percentDone = parseInt(100 - percentLeft);
        return ( percentDone );
      },


      navCal: function() {
        for( var i = 0; i < d.arrows.length; i++ ) {
          var arrow = d.arrows[i],
              dir;

          arrow.addEventListener('click', function(e) {
            e.preventDefault();

            dir = this.getAttribute('data-dir');

            if( dir === 'next') {
              if( c.month === 11 ) {
                c.nextMonth = 0;
                c.nextYear = c.year + 1;
              } else {
                c.nextMonth = c.month + 1;
                c.nextYear = c.year;
              }
            } else if ( dir === 'prev' ) {
              if( c.month === 0 ) {
                c.nextMonth = 11;
                c.nextYear = c.year - 1;
              } else {
                c.nextMonth = c.month - 1;
                c.nextYear = c.year;
              }
            }

            // update the displayNow date
            // create the new calendar
            c.displayNow = new Date(c.nextYear, c.nextMonth, 1);
            t.createCal();
          });
        }
      }
      
    };

window.addEventListener('load', function() {
  calendar.init();
});