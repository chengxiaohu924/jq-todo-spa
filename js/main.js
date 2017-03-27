;
(function () {
  'use strict';

  var $form_add_task = $('.add-task'),
    task_list = [],
    $task_delete, 
    $task_detail_trigger, 
    $task_delete_trigger, 
    $task_detail = $('.task-detail'),
    current_index,
    $task_detail_content_input,
    $task_detail_mask = $('.task-detail-mask'),
    $update_form,
    $task_detail_content;

  init();

  $form_add_task.on('submit', on_add_task_form_submit)
  $task_detail_mask.on('click', hide_task_detail)

  function on_add_task_form_submit(e) {
    var new_task = {},
      $input;
    e.preventDefault();

    $input = $(this).find('input[name=content]');
    new_task.content = $input.val();
    if (!new_task.content) return;

    if (add_task(new_task)) {
      $input.val(null);
    }

  }

  function listen_task_detail() {
    $task_detail_trigger.on('click', function () {
      var $this = $(this);
      var $item = $this.parent().parent();
      var index = $item.data('index');
      show_task_detail(index);
    })
  }

  function show_task_detail(index) {
    render_task_detail(index);
    current_index = index;
    $task_detail.show();
    $task_detail_mask.show();
  }

  function update_task(index, data) {
    if(!index || !task_list[index]) return;

    // task_list[index] = $.merge({}, task_list[index], data);
    task_list[index] = data ;
    // console.log('task_list[index]', task_list[index]);
    refresh_task_list();
}

  function hide_task_detail() {
    $task_detail.hide();
    $task_detail_mask.hide();
  }

  function render_task_detail(index) {
    var index = parseInt(index);
    if (index === undefined || !task_list[index])
      return;
    var item = task_list[index];
    console.log('item', item);
    var tpl = '<form>' +
      '<div class="content input-item">' +
      item.content +
      '</div>' +
      '<div>' + 
      '<input autofocus style="display: none;" name="content" type="text" value="' + (item.content || '') +'">' +
      '</div>' +
      '<div>' +
      '<div class="desc input-item">' +
      '<textarea name="desc">' +
      (item.desc || '') +
      '</textarea>' +
      '</div>' +
      '</div>' +
      '<div class="remind input-item">' +
      '<label> 这个时候提醒我：</label>' +
      '<input class="input-item" name="remind_date" type="date" value="' + (item.remind_date || '') +'">' +
      '</div>' +
      '<div class="input-item"><button type="submit">确认更新</button></div>' +
      '</form>';

    $task_detail.html(null);
    $task_detail.html(tpl);
    $update_form = $task_detail.find('form');
    $task_detail_content = $update_form.find('.content');
    $task_detail_content_input = $update_form.find('[name=content]');
    console.log('$task_detail_content_input', $task_detail_content_input);

    $task_detail_content.on('click', function (e) {
      e.preventDefault();
      $task_detail_content_input.show();
      $task_detail_content.hide();
    })

    $update_form.on('submit', function(e) {
      e.preventDefault();
      var data = {};
      data.content = $(this).find('[name = content]').val();
      data.desc = $(this).find('[name = desc]').val();
      data.remind_date = $(this).find('[name = remind_date]').val();
      
      update_task(index, data);
      hide_task_detail();
    })
  }

  function listen_task_delete() {
    $task_delete_trigger.on('click', function () {
      var $this = $(this);
      var $item = $this.parent().parent();
      var index = $item.data('index');
      var tmp = confirm('你确定？');
      tmp ? task_delete(index) : null;
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

  function task_delete(index) {

    /*如果没有index 或者index不存在则直接返回*/
    console.log( task_list, index, task_list[parseInt(index)]);
    task_list.splice(parseInt(index), 1);
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
      $task_list.prepend($task);
    }

    $task_delete_trigger = $('.anchor.delete')
    $task_detail_trigger = $('.anchor.detail')
    listen_task_delete();
    listen_task_detail();
  }

  function render_task_item(data, index) {
    if (!data || !index) return;
    var list_item_tpl =
      '<div class="task-item" data-index=' + index + '">' +
      '<span><input type="checkbox"> </span>' +
      '<span class="task-content">' + data.content + '</span>' +
      '<span class="fr">' +
      '<span class="anchor delete">删掉</span>' +
      '<span class="anchor detail"> 详细</span>' +
      '</span>' +
      '</div>';
    return $(list_item_tpl);
  }


})();