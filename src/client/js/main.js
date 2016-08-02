$(document).ready(function() {
  	lightbox.option({
    	'albumLabel':   "Imágenes %1 de %2",
        'wrapAround': true
  	});

	$('.static-text').affix({
		  offset: {
		    top: 186
		  }
	});

	var $item = $('#content-banner.carousel .item');
	var $wHeight = $(window).height();
	var $wWidth = $(window).width();
	$item.eq(0).addClass('active');
	$('#content-banner.carousel img').height($wHeight - 86);
	$('#content-banner.carousel img').width($wWidth);
	$('#content-banner.carousel .item-img-about-us img').width($wWidth - 21);
	//$item.addClass("full-screen");

	var $itemAboutUS = $('.img-about-us');
	$itemAboutUS.height($wHeight - 160);
	$itemAboutUS.width($wWidth - 21);
	$itemAboutUS.addClass("full-screen");

	$(window).on('resize', function (){
	  $wHeight = $(window).height();
	  $wWidth = $(window).width();
	  $('#content-banner.carousel img').height($wHeight - 86);
	  $('#content-banner.carousel img').width($wWidth);

	  $('#content-banner.carousel .item-img-about-us img').width($wWidth - 21);

	  $itemAboutUS.height($wHeight - 160);
	  $itemAboutUS.width($wWidth - 21);
	});

	$(".project-highlighted").on("mouseenter", hoverProject);
	$(".project-highlighted").on("mouseleave", unHoverProject);

	function unHoverProject(event){
		$(this).find('.project-hover').addClass('hide');
		$(this).find('.project-unhover').removeClass('hide');
	}

	function hoverProject(event){
		$(this).find('.project-hover').removeClass('hide');
		$(this).find('.project-unhover').addClass('hide');
	}

	$(".image-detail-click").click(function(e){
		e.preventDefault();
		var imgSrc = $(this).attr('data-img-server');
		$(".column-left .img-project").attr('src', imgSrc);
	});

	$('.about-us .text').on('hidden.bs.collapse', function () {
  		$(this).parent().find("i").removeClass("fa-rotate-90");
	});

	$('.about-us .text').on('shown.bs.collapse', function () {
  		$(this).parent().find("i").addClass("fa-rotate-90");
	});


	$('#content-project-image.carousel .item').each(function(i, item){
	  var next = $(this).next();
	  if (!next.length) {
	    next = $(this).siblings(':first');
	  }
	  next.children(':first-child').clone().appendTo($(this));

		next=next.next();
		if (!next.length) {
			next = $(this).siblings(':first');
		}

	  next.children(':first-child').clone().appendTo($(this));
    if($(this).find('.clip:nth-child(2)').length){
      $(this).find('.clip:nth-child(2)').removeClass('col-sm-1').removeClass('clip').addClass('col-sm-10').find("a").attr("data-lightbox", "project-image").find(".image-clip").removeClass(".image-clip");
    } else if($(this).find('.clip').length === 1){
      $(this).find('.clip:nth-child(1)').removeClass('col-sm-1').removeClass('clip').addClass('col-sm-12').find("a").attr("data-lightbox", "project-image").find(".image-clip").removeClass(".image-clip");
      $('.carousel-control').remove();
    }
  });

});
