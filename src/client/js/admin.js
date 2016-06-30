$(document).ready(function() {
	var SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp'];
	var queueFiles = [];
	var countFileOpen = 0;

    tinymce.init({
        selector:'.textarea',
        toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link  | code',
        skin: 'keystone',
        menubar: false,
        plugins: ['code', 'link'],
        language: 'es',
       	setup : function(ed) {
      		ed.on('change', function(e) {
                var id = e.target.id;
                var value = ed.getContent();
				if(value !== ''){
					$("[data-id=" + id +"]").find('i').removeClass("fa-remove").removeClass("text-danger").addClass("text-success").addClass("fa-check");
				} else {
					$("[data-id=" + id +"]").find('i').removeClass("fa-check").removeClass("text-success").addClass("text-danger").addClass("fa-remove");
				}
				$("[data-id=" + id +"]").find(".text-lang").attr("data-value", value);
			});
        }
  	});

  	lightbox.option({
    	'albumLabel':   "Imágenes %1 de %2",
        'wrapAround': true
  	});

	$('.btn-change-file').on('click', function(event){
		event.preventDefault();

		$(this).parent().find('.field-upload-0').click();
	});


	$('.btn-file').on('click', function(event){
		event.preventDefault();

		$(this).parent().find('.field-upload-' + countFileOpen).click();
		countFileOpen++;
		addImageFileInput($(this).parent());

		$('.field-upload-' + countFileOpen).on('change', uploadFile);
	});


	function addImageFileInput(parent){
		parent.append('<input class="field-upload field-upload-'+ countFileOpen +'" type="file" name="project-images" multiple />');
	}

	function addClearSelection(parent){

		parent.find('.clear-selection').removeClass('hide');
	}

	$('.field-upload-' + countFileOpen).on('change', uploadFile);

	$('.clear-selection').click(function(event){
		event.preventDefault();
		$('.image-field-' + countFileOpen).remove();
		countFileOpen--;
		$('.field-upload-' + countFileOpen).remove();
		if(countFileOpen === 0){
			$('.clear-selection').addClass('hide');
		}

	});

	$('.remove-image').click(removeImage);


	function uploadFile(event){
		event.preventDefault();
		var files = event.target.files;
		_.forEach(files, function (f) {
			if (!_.includes(SUPPORTED_TYPES, f.type)) {
				alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP');
				return;
			}

			var fileReader = new FileReader();
			fileReader.onload = function (e) {
				pushThumbnail({ url: e.target.result}, $(event.target));

			};
			fileReader.readAsDataURL(f);

		});
		addClearSelection($(event.target).parent());
		$('.btn-change-file').html($("#ChangeImage").html());

		function pushThumbnail (args, clickContainer) {


			var divImageField = $('<div class="image-field col-sm-3 image-field-'+ countFileOpen +'">');
			divImageField.append(thumbnailImage(args.url));

			clickContainer.parents('.fileinput').find('.image-container').html(divImageField);


			clickContainer.parents('.fileinput').find('.images-new-container').append(divImageField);
		};

		function thumbnailImage(url){
			var anchor = $('<a href="' + url + '" data-lightbox="project-images" class="select-image thumbnail">');
			anchor.append('<img style="height: 90px" server="' + url+ '" />');

			return anchor;
		}

	};

	function removeImage(event){
		event.preventDefault();
		var imageFileName = $(this).attr('imageFileName');
		var id = $(this).attr('data-id');
		var url = $(this).attr('data-url');
		$.post('/admin/' + url + '/' + id + '/image/' + imageFileName + '/delete');
		$(this).parent().remove();
	}


	//Highlight issues
	/*-------------------------------------------------------*/
	$(".highlight").on("click", highlight);
	$(".unhighlight").on("click", unhighligt);
	$(".unhighlight").on("mouseenter", hoverHighlight);
	$(".unhighlight").on("mouseleave", hoverUnHighlight);

	function highlight(event){
		var self = this;
		event.preventDefault();
		$.post('/' + $('html').attr('lang') + '/admin/projects/'+ $(this).find('.projectId').val() + '/highlight/true/update', function(){
			$(self).find('span').html($('#Highlighted').html());
			$(self).find('span').removeClass('text-info').addClass('text-success');
			$(self).find('i').removeClass('fa-upload').addClass('fa-check');
			$(self).find('i').removeClass('text-info').addClass('text-success');
			$(self).removeClass('highlight').addClass('unhighlight');
			$(self).unbind("click");
			$(self).unbind("mouseenter");
			$(self).unbind("mouseleave");
			$(self).on("click", unhighligt);
			$(self).on("mouseenter", hoverHighlight);
			$(self).on("mouseleave", hoverUnHighlight);
		});
	};

	function unhighligt(event){
		var self = this;
		event.preventDefault();
		$.post('/' + $('html').attr('lang') + '/admin/projects/'+ $(this).find('.projectId').val() + '/highlight/false/update', function(){
			$(self).find('span').html($('#Highlight').html());
			$(self).find('span').removeClass('text-danger').addClass('text-info');
			$(self).find('i').removeClass('fa-check').addClass('fa-upload');
			$(self).find('i').removeClass('text-danger').addClass('text-info');
			$(self).removeClass('unhighlight').addClass('highlight');
			$(self).unbind("click");
			$(self).on("click", highlight);
			$(self).unbind("mouseenter");
			$(self).unbind("mouseleave");

		});
	};



	function hoverHighlight(){
		$(this).find('span').html($('#UnHighlight').html());
		$(this).find('span').addClass('text-danger');
		$(this).find('i').addClass('fa-remove');
		$(this).find('i').addClass('text-danger');


	};
	function hoverUnHighlight(){
		$(this).find('span').html($('#Highlighted').html());
		$(this).find('span').removeClass('text-danger');
		$(this).find('i').removeClass('fa-remove');
		$(this).find('i').removeClass('text-danger');

	};



	$(".text-lang").click(function(e){
		e.preventDefault();
		var lang = $(this).attr('data-lang');
		var name = $(this).attr('data-name');
		var value = $(this).attr('data-value');
		$(this).parent().parent().find(".text-lang").parent().removeClass("active");
		$(this).parent().addClass("active");
		translateText(lang, name, value);
	});


	function translateText(lang, name, value){
		var id = name + lang;

		$("textarea[data-name=" + name + "]").parent().addClass("hide");
		$("#" + id).parent().removeClass("hide");
		$("#" + id).focus();
		$("#" + id).html(value);
	}



	$(".textbox-change").bind("change paste keyup", function(e){
		var value = e.target.value;
		var id = e.target.id;
		if(value !== ''){
			$("[data-id=" + id +"]").find('i').removeClass("fa-remove").removeClass("text-danger").addClass("text-success").addClass("fa-check");

		} else {
			$("[data-id=" + id +"]").find('i').removeClass("fa-check").removeClass("text-success").addClass("text-danger").addClass("fa-remove");
		}
		$("[data-id=" + id +"]").find(".textbox-lang").attr("data-value", value);
	});



	$(".textbox-lang").click(function(e){
		e.preventDefault();
		var lang = $(this).attr('data-lang');
		var name = $(this).attr('data-name');
		var value = $(this).attr('data-value');
		$(this).parent().parent().find(".textbox-lang").parent().removeClass("active");
		$(this).parent().addClass("active");
		translateTextbox(lang, name, value);
	});

	function translateTextbox(lang, name, value){
		var id = name + lang;

		$("input[data-name=" + name + "]").attr("type", "hidden");
		$("#" + id).attr("type", "text");
		$("#" + id).focus();
		$("#" + id).val(value);
	}

});
