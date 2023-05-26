

  function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(i);
  }
  jQuery(function () {
    jQuery(".trash").click(function () {
      swal({
        title: "Cảnh báo",

        text: "Bạn có chắc chắn là muốn xóa nhân viên này?",
        buttons: ["Hủy bỏ", "Đồng ý"],
      })
              .then((willDelete) => {
                if (willDelete) {
                  swal("Đã xóa thành công.!", {

                  });
                }
              });
    });
  });
  oTable = $('#sampleTable').dataTable();
  $('#all').click(function (e) {
    $('#sampleTable tbody :checkbox').prop('checked', $(this).is(':checked'));
    e.stopImmediatePropagation();
  });


  //Thời Gian
  function time() {
    var today = new Date();
    var weekday = new Array(7);
    weekday[0] = "Chủ Nhật";
    weekday[1] = "Thứ Hai";
    weekday[2] = "Thứ Ba";
    weekday[3] = "Thứ Tư";
    weekday[4] = "Thứ Năm";
    weekday[5] = "Thứ Sáu";
    weekday[6] = "Thứ Bảy";
    var day = weekday[today.getDay()];
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    nowTime = h + " giờ " + m + " phút " + s + " giây";
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = day + ', ' + dd + '/' + mm + '/' + yyyy;
    tmp = '<span class="date"> ' + today + ' - ' + nowTime +
            '</span>';
    document.getElementById("clock").innerHTML = tmp;
    clocktime = setTimeout("time()", "1000", "Javascript");

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
  }


  //Modal
  $("#show-emp").on("click", function () {
    $("#ModalUP").modal({ backdrop: false, keyboard: false })
  });





    function readURL(input, thumbimage) {
        if (input.files && input.files[0]) { //Sử dụng  cho Firefox - chrome
          var reader = new FileReader();
          reader.onload = function (e) {
            $("#thumbimage").attr('src', e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
        }
        else { // Sử dụng cho IE
          $("#thumbimage").attr('src', input.value);
  
        }
        $("#thumbimage").show();
        $('.filename').text($("#uploadfile").val());
        $('.Choicefile').css('background', '#14142B');
        $('.Choicefile').css('cursor', 'default');
        $(".removeimg").show();
        $(".Choicefile").unbind('click');
  
      }
      $(document).ready(function () {
        $(".Choicefile").bind('click', function () {
          $("#uploadfile").click();
  
        });
        $(".removeimg").click(function () {
          $("#thumbimage").attr('src', '').hide();
          $("#myfileupload").html('<input type="file" id="uploadfile"  onchange="readURL(this);" />');
          $(".removeimg").hide();
          $(".Choicefile").bind('click', function () {
            $("#uploadfile").click();
          });
          $('.Choicefile').css('background', '#14142B');
          $('.Choicefile').css('cursor', 'pointer');
          $(".filename").text("");
        });
      })