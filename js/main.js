;(function() {
  'use strict';

  var $form_add_task = $('.add-task')
  , task_list = {}
  ;



  init();

  $form_add_task.on('submit', function(e) {
    var new_task = {}, $input;
    e.preventDefault();

    $input = $(this).find('input[name=content]');
    new_task.content = $input.val();
    if (!new_task.content) return;

    if (add_task(new_task)) {
      $input.val(null);
  }

  });
//方法： add_task(),init(),render_task_list(),render_task_item()
  function add_task(new_task) {
    task_list.push(new_task);
    store.set('task_list', task_list);
     render_task_list();
    return true;
}

  function init() {
    task_list = store.get('task_list') || [];
    console.log('task_list', task_list);
    if (task_list.length) {
      render_task_list();
    }
  }


  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    for (var i = 0; i < task_list.length; i++) {
      var $task = render_task_item(task_list[i]);
    $task_list.append($task); 
    }
  }

  function render_task_item(data) {
    var list_item_tpl =      
      '<div class="task-item">' +
          '<span><input type="checkbox"> </span>' +
          '<span class="task-content">' + data.content + '</span>' +
        '<span class="fr">' +
          '<span class="anchor">懦夫</span>' +
          '<span class="anchor"> 搞定</span>' +
        '</span>' +
    '</div>';
      return $(list_item_tpl);
  }

  
})();