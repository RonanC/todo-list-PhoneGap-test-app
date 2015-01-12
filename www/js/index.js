var taskList = new Array();

$(document).ready(function() {
    // alert to make sure all our references are correct
    //alert('');

    // $ used to identity variables that are related to jQuery
    // go to DOM look for element with the id, and assign it locally
    var $newTaskInput = $('#newTaskInput');
    var $taskList = $('#taskList');
    // for validation, same element swipe
    var taskTouchStart;
    var taskTouchEnd;
    // left or right swipe?
    var taskTouchStartX;
    var taskTouchEndX;

    // id local storage exists
    if (window.localStorage) {
        taskList = JSON.parse(window.localStorage.getItem('taskList'));
    }

    // if we have data, LOAD
    if (null !== taskList) {
        for (i = 0; i < taskList.length; i++) {
            var newTask = '<li data-key="' + taskList[i].key + '"><span>' + taskList[i].task + '</span></li>';
            $taskList.append(newTask);
        }
    } else {
        taskList = new Array();
    }

    // add new task
    $('#addNewTask').on('click', function() {
        var key = Date.now();
        // data- is a way HTML5 allows us to add customized attributes to tags
        var newTask = '<li data-key="' + key + '"><span>' + $newTaskInput.val() + '</span></li>';
        $taskList.append(newTask);
        taskList.push({
            key: key,
            task: $newTaskInput.val(),
            done: false
        });
        // localStorage works only in strings
        if (window.localStorage) {
            window.localStorage.setItem('taskList', JSON.stringify(taskList));
        }
        $newTaskInput.val(''); // sets it as empty
    });

    // touchstart
    $taskList.on('touchstart', 'li', function(e) {
        // allows us to use co-ordinates, gives us an array of all the touches going on at that moment, multiple fingers accepted
        // working now with one touch
        var start = document.elementFromPoint(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
        taskTouchStart = $(start).attr('data-key');
        //alert(taskTouchStart);
        taskTouchStartX = e.originalEvent.touches[0].pageX;
    });

    // touchend
    $taskList.on('touchend', 'li', function(e) {
        var $end;
        var $this = $(this);
        var end;
        var end = document.elementFromPoint(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
        $end = $(end);

        taskTouchEnd = $end.attr('data-key');
        taskTouchEndX = e.originalEvent.touches[0].pageX;

        // validation
        if (taskTouchStart == taskTouchEnd) {
            // left swipe
            if (taskTouchStartX < taskTouchEndX) {
                if ($this.hasClass('done')) {
                    $this.removeClass('done');
                } else {
                    $this.addClass('done');
                }
            }
            // right swipe
            else {
                taskList = $.grep(taskList, function(e) {
                    return e.key != taskTouchEnd;
                });
                // localStorage works only in strings
                if (window.localStorage) {
                    window.localStorage.setItem('taskList', JSON.stringify(taskList));
                }
                $end.remove();
            }
        }
    });



});