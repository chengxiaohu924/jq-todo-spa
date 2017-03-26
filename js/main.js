;(function() {
  'use strict';

  var $form_add_task = $('.add-task')
  , task_list = []
  , $delete_task
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

function listen_task_delete() {
    $delete_task.on('click', function() {
      var $this = $(this);
      var $item = $this.parent().parent();
      var index = $item.data('index');
      console.log('index', index);
      var tmp = confirm('你确定？');
      tmp ? delete_task(index) : null;
  }) 
}




  function add_task(new_task) {
    task_list.push(new_task);
    refresh_task_list();
    return true;
}

  function refresh_task_list() {
  store.set('task_list', task_list);
  render_task_list();
}

  function delete_task(index) {
    
    /*如果没有index 或者index不存在则直接返回*/
    
    task_list.pop(task_list[index]);
    console.log('task_list', task_list);
    /*更新localStorage*/
    refresh_task_list();
  }

  function init() {
    task_list = store.get('task_list') || [];
    if (task_list.length) 
      render_task_list();
  }


  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    for (var i = 0; i < task_list.length; i++) {
    var $task = render_task_item(task_list[i], i);
    $task_list.append($task); 
  }
  
    $delete_task = $('.anchor.delete')
    listen_task_delete();
  }

  function render_task_item(data, index) {
    if(!data || !index) return;
    var list_item_tpl =      
      '<div class="task-item" data-index=' + index + '">' +
          '<span><input type="checkbox"> </span>' +
          '<span class="task-content">' + data.content + '</span>' +
        '<span class="fr">' +
          '<span class="anchor delete">懦夫</span>' +
          '<span class="anchor"> 搞定</span>' +
        '</span>' +
    '</div>';
      return $(list_item_tpl);
  }

  
})();