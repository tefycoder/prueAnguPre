/************************************************************************************************************
	(C) www.dhtmlgoodies.com, October 2005
	
	This is a script from www.dhtmlgoodies.com. You will find this and a lot of other scripts at our website.	
	
	Terms of use:
	You are free to use this script as long as the copyright message is kept intact. However, you may not
	redistribute, sell or repost it without our permission.
	
	Thank you!
	
	www.dhtmlgoodies.com
	Alf Magne Kalleland
	
	************************************************************************************************************/	
	// You can modify these three values
	var slideshow2_noFading = false;	// Just normal show/hide without fading ?
	var slideshow2_timeBetweenSlides = 4000;	// Amount of time between each image(1000 = 1 second)
	var slideshow2_fadingSpeed = 6;	// Speed of fading
	
	
	/* Don't change any of these values */
	var slideshow2_galleryHeigh;	// Height of galery	
	var slideshow2_galleryContainer;	// Reference to the gallery div
	var slideshow2_galleryWidth;	// Width of gallery	
	var slideshow2_slideIndex = -1;	// Index of current image shown
	var slideshow2_slideIndexNext = false;	// Index of next image shown
	var slideshow2_imageDivs = new Array();	// Array of image divs(Created dynamically)
	var slideshow2_currentOpacity = 100;	// Initial opacity
	var slideshow2_imagesInGallery = false;	// Number of images in gallery

	//	chris
	var galleryTextArray	= new Array();
	
	function getGalleryImageSize(imageIndex)
	{
		if(imageIndex==slideshow2_imagesInGallery){			
			showGallery();
		}else{
			var imgObj = document.getElementById('galleryImage' + imageIndex);
			var imgWidth = imgObj.width;
			var imgHeight = imgObj.height;
			if(imgWidth>50){						
				
				var tmpDiv = document.createElement('DIV');
				tmpDiv.id = 'galleryDiv' + imageIndex;
				tmpDiv.style.visibility = 'hidden';
				tmpDiv.className='imageInGallery';
				slideshow2_galleryContainer.appendChild(tmpDiv);
				tmpDiv.appendChild(imgObj);
				
				//	 chris - add desc overlay
				var imgDesc=document.createElement('DIV');
				imgDesc.className='imageInGallery_DESC';
				imgDesc.innerHTML=galleryTextArray[imageIndex];
				tmpDiv.appendChild(imgDesc);
				
				imgObj.style.left = Math.round((slideshow2_galleryWidth - imgWidth)/2)  + "px";
				imgObj.style.top = Math.round((slideshow2_galleryHeight - imgHeight)/2)  + "px";
				tmpDiv.style.visibility = 'hidden';
				slideshow2_imageDivs.push(tmpDiv);
				imageIndex++;
				getGalleryImageSize(imageIndex);
			}else{
				setTimeout('getGalleryImageSize(' + imageIndex + ')',10);
			}
		}		
	}
	
	function showGallery()
	{
		if(slideshow2_slideIndex==-1)slideshow2_slideIndex=0; else slideshow2_slideIndex++;	// Index of next image to show
		if(slideshow2_slideIndex==slideshow2_imageDivs.length)slideshow2_slideIndex=0;
		slideshow2_slideIndexNext = slideshow2_slideIndex+1;	// Index of the next next image
		if(slideshow2_slideIndexNext==slideshow2_imageDivs.length)slideshow2_slideIndexNext = 0;
		
		slideshow2_currentOpacity=100;	// Reset current opacity

		// Displaying image divs
		slideshow2_imageDivs[slideshow2_slideIndex].style.visibility = 'visible';
		if(navigator.userAgent.indexOf('Opera')<0){
			slideshow2_imageDivs[slideshow2_slideIndexNext].style.visibility = 'visible';
			
		}
		
		
		if(document.all){	// IE rules
			slideshow2_imageDivs[slideshow2_slideIndex].style.filter = 'alpha(opacity=100)';
			slideshow2_imageDivs[slideshow2_slideIndexNext].style.filter = 'alpha(opacity=1)';
		}else{
			slideshow2_imageDivs[slideshow2_slideIndex].style.opacity = 0.99;	// Can't use 1 and 0 because of screen flickering in FF
			slideshow2_imageDivs[slideshow2_slideIndexNext].style.opacity = 0.01;
		}		
		

		setTimeout('revealImage()',slideshow2_timeBetweenSlides);		
	}
	
	function revealImage()
	{
		if(slideshow2_noFading){
			slideshow2_imageDivs[slideshow2_slideIndex].style.visibility = 'hidden';
			showGallery();
			return;
		}
		//slideshow2_currentOpacity--;
		slideshow2_currentOpacity=slideshow2_currentOpacity-10;
		if(document.all){
			slideshow2_imageDivs[slideshow2_slideIndex].style.filter = 'alpha(opacity='+slideshow2_currentOpacity+')';
			slideshow2_imageDivs[slideshow2_slideIndexNext].style.filter = 'alpha(opacity='+(100-slideshow2_currentOpacity)+')';
		}else{
			slideshow2_imageDivs[slideshow2_slideIndex].style.opacity = Math.max(0.01,slideshow2_currentOpacity/100);	// Can't use 1 and 0 because of screen flickering in FF
			slideshow2_imageDivs[slideshow2_slideIndexNext].style.opacity = Math.min(0.99,(1 - (slideshow2_currentOpacity/100)));
		}
		if(slideshow2_currentOpacity>0){
			setTimeout('revealImage()',slideshow2_fadingSpeed);
		}else{
			slideshow2_imageDivs[slideshow2_slideIndex].style.visibility = 'hidden';			
			showGallery();
		}
	}
	
	function initImageGallery()
	{
		slideshow2_galleryContainer = document.getElementById('imageSlideshowHolder');
		slideshow2_galleryWidth = slideshow2_galleryContainer.clientWidth;
		slideshow2_galleryHeight = slideshow2_galleryContainer.clientHeight;
		galleryImgArray = slideshow2_galleryContainer.getElementsByTagName('IMG');
		
		
		captions=document.getElementById('the_captions');
		galleryDescArray = captions.getElementsByTagName('DIV');
		
		
		for(var no=0; no<galleryImgArray.length;no++){
			galleryImgArray[no].id = 'galleryImage' + no;
			//	chris - get caption
			galleryTextArray[no]=galleryDescArray[no].innerHTML;
		}
		slideshow2_imagesInGallery = galleryImgArray.length;
		getGalleryImageSize(0);		
		
	}