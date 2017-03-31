
;(function () {
  'use strict';

  var $form_add_task = $('.add-task'),
    $window = $(window),
    $body = $('body'),
    task_list = [],
    $task_delete, 
    $task_detail_trigger, 
    $task_delete_trigger, 
    $task_detail = $('.task-detail'),
    current_index,
    $task_detail_content_input,
    $task_detail_mask = $('.task-detail-mask'),
    $update_form,
    $task_detail_content,
    $checkbox_complete
    , $msg = $('.msg')
    , $msg_content = $msg.find('.msg-content')
    , $msg_confirm = $msg.find('.confirmed')
    , $alerter = $('.alerter')
    ;

  init();

  $form_add_task.on('submit', on_add_task_form_submit)
  $task_detail_mask.on('click', hide_task_detail)

  function listen_msg_event() {
    $msg_confirm.on('click', function () {
      hide_msg();
    })
  }

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
      var index;
    $('.task-content').on('click', function () {
      index = $(this).parent().data('index');
      show_task_detail(index);
    })

    $task_detail_trigger.on('click', function () {
      var $this = $(this);
      var $item = $this.parent().parent();
      index = $item.data('index');
      show_task_detail(index);
    })
  }

  function listen_checkbox_complete() {
    $checkbox_complete.on('click', function () {
      var $this = $(this);
      var index = $this.parent().parent().data('index');
      var index = parseInt(index);
      var item = get(index);
      if (item.complete)
        update_task(index, {complete: false});
      else
        update_task(index, {complete: true});
    })
  }

  function get(index) {
    return store.get('task_list')[index];
  }

  function show_task_detail(index) {
    render_task_detail(index);
    current_index = index;
    $task_detail.show();
    $task_detail_mask.show();
  }

  function update_task(index, data) {
    if (!index || !task_list[index])     return;
    console.log('data', data);
    console.log('task_list[index]', task_list[index]);
    task_list[index] = $.extend({}, task_list[(index)], data);
    refresh_task_list();
    console.log('data', data);
    console.log('task_list[index]', task_list[index]);
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
    // console.log('item', item);
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
      '<label><span class="icon icon-alarm"></span> 这个时候提醒我：</label>' +
      '<input class="datetime input-item" name="remind_date" type="text" value="' + (item.remind_date || '') +'">' +
      '</div>' +
      '<div class="input-item"><button type="submit">确认更新</button></div>' +
      '</form>';

    $task_detail.html(null);
    $task_detail.html(tpl);
    $('.datetime').datetimepicker();
    $update_form = $task_detail.find('form');
    $task_detail_content = $update_form.find('.content');
    $task_detail_content_input = $update_form.find('[name=content]');
    // console.log('$task_detail_content_input', $task_detail_content_input);

    $task_detail_content.on('click', function () {
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
    //console.log('refresh_task_list', task_list);
    render_task_list();
  }

  function task_delete(index) {
    var index = parseInt(index);
    if (index === undefined || !task_list[index]) return;
    /*如果没有index 或者index不存在则直接返回*/
    delete task_list[index];
    /*更新localStorage*/
    refresh_task_list();
  }

  function init() {
    task_list = store.get('task_list') || [];
      listen_msg_event();
    // console.log('task_list', task_list);
    if (task_list.length)
      render_task_list();
      task_remind_check();
  }

   function task_remind_check() {
    var current_timestamp;
    var itl = setInterval(function () {
      for (var i = 0; i < task_list.length; i++) {
        var item = get(i), task_timestamp;
        if (!item || !item.remind_date || item.informed)
          continue;

        current_timestamp = (new Date()).getTime();
        task_timestamp = (new Date(item.remind_date)).getTime();
        if (current_timestamp - task_timestamp >= 1) {
          update_task(i, {informed: true});
          show_msg(item.content);
        }
      }
    }, 300);
  }

  function show_msg(msg) {
    if (!msg) return;

    $msg_content.html(msg);
    $alerter.get(0).play();
    $msg.show();
  }

  function hide_msg() {
    $msg.hide();
  }




  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    var complete_items = [];
    for (var i = 0; i < task_list.length; i++) {
      var item =task_list[i];
      if (item && item.complete)
        complete_items[i] = item;
      else
        var $task = render_task_item(item, i);
    $task_list.prepend($task);
    }

    for(var j = 0; i < complete_items.length;j++) {
      $task = render_task_item(complete_items[j], j);
      if (!$task) continue;
      $task.addClass('completed');
      $task_list.append($task);
    }


    $task_delete_trigger = $('.anchor.delete')
    $task_detail_trigger = $('.anchor.detail')
    $checkbox_complete = $('.task-list .complete[type=checkbox]')
    listen_task_delete();
    listen_task_detail();
    listen_checkbox_complete();
  }

  function render_task_item(data, index) {
    if (!data || !index) return;
   // console.log(index, data);
    var list_item_tpl =
      '<div class="task-item" data-index=' + index + '">' +
      '<span><input class="complete"' + (data.complete ? 'checked' : '') + 'type="checkbox">  </span>' +
      '<span class="task-content">' + data.content + '</span>' +
      '<span class="fr">' +
      '<span class="anchor delete"><span class="icon icon-cross"></span></span>' +
      '<span class="anchor detail">' + '&nbsp&nbsp&nbsp' + '<span class="icon icon-zoom-in"></span></span>' +
      '</span>' +
      '</div>';
    return $(list_item_tpl);
  }


})();