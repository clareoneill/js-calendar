var t,
    s,
    calendar = {
      
      arrays: {
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        daysInMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      },
       
      settings: {
        now: '',
        nowTime: '',
        date: '',
        day: '',
        niceDay: '',
        month: '',
        niceMonth: '',
        year: '',
        firstDay: '',
        monthLength: '',
        calHTML: ''
      },
      
      divs: {
        month: document.getElementById('month'),
        cal: document.getElementById('calendar'),
        days: ''
      },
      
      init: function() {
        t = this;
        a = t.arrays;
        s = t.settings;
        d = t.divs;
        
        // get today's stuff
        s.now = new Date();
        s.nowTime = s.now.getTime();
        s.date = s.now.getDate();
        s.day = s.now.getDay();
        s.month = s.now.getMonth();
        s.year = s.now.getFullYear();
        
        // get the first day of the month
        s.firstDay = new Date(s.year, s.month, 1);
        s.firstDay = s.firstDay.getDay();
        
        // get the number of days in this month
        s.monthLength = a.daysInMonths[s.month];
        // leap year
        if ( s.month == 1 ) { // February only!
          if( ( s.year % 4 === 0 && s.year % 100 !== 0 ) || s.year % 40 === 0 ){
            s.monthLength = 29;
          }
        }
        
        // convert the day and month into words
        s.niceDay = a.days[s.day];
        s.niceMonth = a.months[s.month];
        
        // create the calendar
        t.createCal();
      },
      
      createCal: function() {
        d.month.innerHTML = s.niceMonth;

        var day = 1;
        // create the weeks
        for( var i = 0; i < 9; i++ ) {
          s.calHTML += '<div class="row">';
          
          // create the days
          for( var j = 0; j < 7; j++ ) {
            
            // only add an actual date if it's on or after the first day of the month
            if( day <= s.monthLength && ( i > 0 || j >= s.firstDay ) ) {
              
              if( day === s.date ) {
                s.calHTML += '<div class="item" id="today" data-dow="' + j + '">';
              } else {
                s.calHTML += '<div class="item" data-dow="' + j + '">';
              }
              s.calHTML += '<span class="bg"></span>';
              s.calHTML += '<span class="num">';
              s.calHTML += day;
              day++;
              s.calHTML += '</span>';
              s.calHTML += '</div>';

            } else {
              s.calHTML += '<div class="item hidden-vert">';
              s.calHTML += '<span class="bg"></span>';
              s.calHTML += '<span class="num"></span>';
              s.calHTML += '</div>';
            }

          
          }
          s.calHTML += '</div>';

          // stop looping after the month is done
          if( day > s.monthLength ) {
            break;
          }
        }
        
        // append to the calendar
        d.cal.innerHTML += s.calHTML;
        
        // grab all the items in a variable
        // then update the calendar
        // then set interval to update calendar every 15 minutes
        d.days = document.getElementsByClassName('item');
        t.updateCal();
        setInterval(function() {
          t.updateCal();
        }, 60 * 1000 * 15 ); // 60 * 1000 milsec * 15
        
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
            // if the number div is empty (starting empty divs)
            // assign date as 0
            if( !boxDay ) {
              boxDay = 0;
            }

            // loop through the background div
            for( var b = 0; b < bg.length; b++ ) {
              // if it's before today, set height of bg to 100%
              if( boxDay < s.date ) {
                bg[b].style.height = '100%';
              // if it's today, add the bg--today class
              // then update the height based on how close to midnight it is
              } else if ( boxDay === s.date ) {
                bg[b].classList.add('bg--today');
                bg[b].style.height = t.minutesUntilMidnight() + '%';

                console.log(t.minutesUntilMidnight());
              }
            }
          }
        }
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
      }
      
    };

window.addEventListener('load', function() {
  calendar.init();
});