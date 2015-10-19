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
        calHTML: '',
        today: false
      },
      
      divs: {
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
        s.year = s.now.getYear();
        
        // get the first day of the month
        s.firstDay = new Date(s.year, s.month, 1);
        s.firstDay = s.firstDay.getDay();
        
        // get the number of days in this month
        s.monthLength = a.daysInMonths[s.month];
        // leap year
        if ( s.month == 1 ) { // February only!
          if( ( s.year % 4 == 0 && s.year % 100 != 0 ) || s.year % 40 == 0 ){
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
        var day = 1;
        
        // create the weeks
        for( var i = 0; i < 9; i++ ) {
          s.calHTML += '<div class="row">';
          
          // create the days
          for( var j = 0; j < 7; j++ ) {
            s.calHTML += '<div class="item">';
            if( day <= s.monthLength && ( i > 0 || j >= s.firstDay ) ) {
              
              s.calHTML += '<span class="bg"></span><span class="num">';
              s.calHTML += day;
              s.calHTML += '</span>';
             
              day++;
            }
            s.calHTML += '</div>';
          }
          s.calHTML += '</div>';
          if( day > s.monthLength ) {
            break;
          }
        }
        
        // append to the calendar
        d.cal.innerHTML += s.calHTML;
        
        // update the calendar
        // then set interval to update calendar every minute
        d.days = document.getElementsByClassName('item');
        t.updateCal();
        setInterval(function() {
          t.updateCal();
        }, 60 * 1000); // 60 * 1000 milsec
        
      },
      
      updateCal: function() {
        console.log(d.days);
        
        for( var d = 0; d < d.days.length; d++ ) {
          var num = d.days[d].getElementsByClassName('num');
          console.log(num);
          /*if( num.length > 0 ) {
            for( var n = 0; n < num.length; n++ ) {
              console.log('num');
            }
          }*/
          
        }
      }
      
    };

window.addEventListener('load', function() {
  calendar.init();
});