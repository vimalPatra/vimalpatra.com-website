(function(){
	"use strict";



		// decaring variables
	 var skillsListToggleStatus, 
	 documentHeight, windowHeight, windowWidth,
	 icons,
	 header, headerNavMain, headerMobNavMain, headerNavToggleIcons, headerMobNavToggleIcons,
	 headerPullIcons, headerPushIcons, headerMobPullIcons, headerMobPushIcons,
	 
	 footer, 
	 secondaryNav, secondaryNavOpen, secondaryNavClose,
	 socialNav, socialNavOpen,socialNavClose, 

	 links, redirLinks,
	 modalLinks, disabledLinks, headerScrollLinks, scrollingLinks, scrollToTop,
	 scrollingContainer, scrollPos,

	 $window, html, wrap, header, parallaxGroup, mainSection, fixedElements,

	 		/*parallaxLayers,*/ 
	 skillsLayer, technologies, listContainer, expandListContainer, technologyList, 

	 contactLayer, contactForm, 
	 cfInput, cfTextarea, cfSelectBoxes, cfPurpose, cfAllFields, cfSubmit, 
	 selectHelpText, cfReqText, cfMailText, cfSubmitWaitText, 

	 placeHolderDefault, selectDefaultText, selectNullText, purposeAlts, 
	 
	 listContainerDefaultHeight,

	 scrollPositionOfHashLinks = [],

	 helpboxBtn,

	 helpboxTemplate, modalTemplate, alertTemplate;



	skillsListToggleStatus = {};

	$window = $(window);

	 	// scroller
	scrollingContainer = $window;
	scrollPos = 0;

		// get dimensions of the window in js
	windowWidth = $window.width();
	windowHeight = $window.height();
	


		// elements


	html = $("html");
	documentHeight = html.height();

	fixedElements = html.find('.pos-fixed-bug');
	wrap = $("#wrap");
	header = $("#header");
	parallaxGroup = wrap.find(".parallax__group");
	mainSection = parallaxGroup.find(".main");

	skillsLayer = $("#skills");
	technologies = skillsLayer.find(".technologies");
	listContainer = technologies.find(".list__container");
	expandListContainer = listContainer.find(".expand");
	technologyList = listContainer.find(".technologyList");

	contactLayer = $("#contact");
	contactForm = $("#contactForm");


		// contact form elements
	cfInput = contactForm.find('input');
	cfTextarea = contactForm.find('textarea');
	cfSelectBoxes = contactForm.find("select");
	cfPurpose = cfSelectBoxes.filter('#purposeC');
	cfAllFields = cfInput.add(cfTextarea).add(cfSelectBoxes);
	cfSubmit = contactForm.find('#cfSubmit');

	// console.log('cfInput from top');
	// console.log(cfInput);
	// console.log(contactForm);
		// icons
	icons = $(".icon"),
	header = $('#header');
	headerNavMain = header.find('.nav-main'),
	headerMobNavMain = header.find('.nav-main--mob'),
	headerNavToggleIcons = headerNavMain.find(".icon--toggle"),
	headerMobNavToggleIcons = headerMobNavMain.find(".icon--toggle"),

	headerPullIcons = headerNavToggleIcons.filter(".icon--pull"), // header's open toggle icons
	headerPushIcons = headerNavToggleIcons.filter(".icon--push"), // header's hide toggle icons
	headerMobPullIcons = headerMobNavToggleIcons.filter(".icon--pull"), // header's open toggle icons for mobiles
	headerMobPushIcons = headerMobNavToggleIcons.filter(".icon--push"), // header's hide toggle icons for mobiles

	

	footer = $("#footer"),
	secondaryNav = footer.find(".nav-sec"),
	secondaryNavOpen = secondaryNav.find(".icon--pull"),	// footer's show toggle icons
	secondaryNavClose = secondaryNav.find(".icon--push"), // footer's hide toggle icons
	
	socialNav = footer.find(".nav-social"),
	socialNavOpen = socialNav.find(".icon--pull"),	// footer's show toggle icons
	socialNavClose = socialNav.find(".icon--push"), // footer's hide toggle icons



		// links
	redirLinks = $("a").not(".link").not(".navHoverEffect").not(".noEffect"), //  anchor tags that redirect to other pages
	links = $(".link"), // all anchors/links that leads to opening a modal or scrolling but not navigating to other page
	modalLinks = links.filter(".link--open__modal");

	headerScrollLinks = header.find(".link--scroll"), // a tags in header that scroll to a part of the page.. needed to highlight them properly on scrolling

	scrollingLinks = links.filter(".link--scroll"),	// links that link to some scroll point in the document itself 
	scrollToTop = scrollingLinks.filter(".link--go-to-top"); // scroll to top button

		//buttons

	helpboxBtn = html.find(".open__helpbox");

		// templates

	helpboxTemplate = $("script#helpboxTemplate");
	modalTemplate = $("script#modalTemplate");
	alertTemplate = $("script#alertTemplate");
	
		// font sizes and all  other rigid values that we need to get or set
	listContainerDefaultHeight = 150;


	cfSubmitWaitText = 'Wait please',
	placeHolderDefault = "";
	selectDefaultText = "not selected";
	selectNullText = "";
	selectHelpText = " ( ↑ or ↓ to navigate / ↵ to toggle dropdown)";

	purposeAlts = {
		hello: {
			submitBtnText: 'send message',
			textareaPlaceholder: 'type down your message'
		},
		hire: {
			submitBtnText: "let's talk work",
			textareaPlaceholder: "describe your project including the specifics and the budget"
		},
		business: {
			submitBtnText: "let's talk business",
			textareaPlaceholder: "please describe your proposal"
		},
		report: {
			submitBtnText: 'report problem',
			textareaPlaceholder: "what problem did you find ?"
		},
		cheer: {
			submitBtnText: 'praise me asap',
			textareaPlaceholder: "please let me know.. what did you find great about the website ?"
		},
		default: {
			submitBtnText: 'send',
			textareaPlaceholder: cfTextarea.data('placeholder')
		}
	}

	cfReqText = $.trim(contactForm.data("required-text")) || "This field must be filled";
	
	cfMailText = $.trim(contactForm.data("valid-email-text")) || "E-mail Address must be valid";






				/***********************

					=event handlers
				
				***********************/

						/*
							major handlers
						*/

		// run these when dom ready (and elements are cached)
	doSessionWorkOnLoad();
	checkBreakpoints();



			// unload hander
	$window.on("unload",function(){
		window.sessionStorage.setItem("lastScrollPos",scrollingContainer.scrollTop());
		
	});


			// load handler
	$window.on("load",onLoad);

			// touchend handler

	$window.on("touchend",throttle(handleTouchend,10));


			// resize handler

	$window.on("resize",debounce(handleResize,50));


	


			// scroll handler
	$(scrollingContainer).on("scroll",function(){
		scrollPos = $(scrollingContainer).scrollTop();
		requestAnimationFrame(onScroll);
	});


						/*
							minor handlers
						*/



	// technologyList toggle handler (inside the skills section) 
	function technologyListToggleHandler(){
		var setTimeoutDelayForSettingHeights = 600;

		listContainer.each(function(i,elem){
			var $elem = $(elem); // listcontainer
			var technologyList = $elem.find(".technologyList");
			var listOrderDesc = $elem.find(".list__order__desc");
			var initialHeightOfListOrderDesc = listOrderDesc.outerHeight();
			var arrow = $elem.find(".arrow");
			var listHeight = technologyList.height();
			var expand = $elem.find(".expand");

			// alert(technologyList.height());
			if (!initialHeightOfListOrderDesc) {
				initialHeightOfListOrderDesc = 0;
			}

			var objForExpand = {
				listContainer: $elem,
				listHeight: (listHeight + initialHeightOfListOrderDesc),
				listOrderDesc: listOrderDesc,
				arrow: arrow,
				initialHeightOfListOrderDesc: initialHeightOfListOrderDesc
			};

			var objForCollapse = {
				listContainer: $elem,
				listHeight: listContainerDefaultHeight,
				listOrderDesc: listOrderDesc,
				arrow: arrow
			};


			TweenLite.set(listOrderDesc,{
				autoAlpha: 0,
				height: 0,
				transformOrigin: "50% 0"
			});

			TweenLite.set(arrow,{
				autoAlpha:0,
				scaleY: 0,
				transformOrigin: "0 0"
			}); 


			function saveToSession(obj){
				var id = obj.id, setTo = obj.setTo;
				
				skillsListToggleStatus[id] = setTo;
				
				window.sessionStorage.setItem(
					"skillsListToggleStatus",
					JSON.stringify(skillsListToggleStatus)
				);

			}	


			function callExpandList(obj){
				var $this = $(this); // button that is clicked

				$this.off("click");	
				$this.on("click",callCollapseList.bind(expand,objForCollapse));

				saveToSession({
					id: $elem[0].id,
					setTo: true
				});
				
				TweenLite.set($elem,{
					'will-change': 'height'
				});

				expandListFunc.call($this,obj);

			}

			function callCollapseList(obj){
				var $this = $(this);

				$this.off("click");
				$this.on("click",callExpandList.bind(expand,objForExpand));

				saveToSession({
					id: $elem[0].id,
					setTo: undefined
				});

				TweenLite.set($elem,{
					'will-change': 'height'
				});

				collapseListFunc.call($this,obj);

			}

			if (!$elem.hasClass('expanded')) {

				(function(expand,objForExpand){
					expand.on("click",callExpandList.bind(expand,objForExpand));
				})(expand,objForExpand);

			}else{	

				(function(expand,objForCollapse){
					expand.on("click",callCollapseList.bind(expand,objForCollapse));
				})(expand,objForCollapse);
					
			}
			
		}); /* listContainer.each ENDS*/
	}

	technologyListToggleHandler();




			/**************************************

				Event Callback functions
			
			**************************************/



						/*
							major callbacks
						*/


	

	function onLoad(){
		// should be in the same order

		checkLocalStorage(); // store and check local storage (must be the first thing on load)

		loadingAnimations(); // loader animations
	
	}



			// onScroll function to be invoked when scroll container is scrolled
	function onScroll(){
		var sp = scrollPos;
		var scArr = scrollPositionOfHashLinks;
		var hScrlinks = headerScrollLinks;
		
		hScrlinks.removeClass("navActiveEffect");

		$.each(scArr,function(i,hashLinkPos){

			if ( (sp >= hashLinkPos && sp < scArr[i+1]) ||  (sp >= hashLinkPos && scArr[scArr.length - 1] == hashLinkPos )) {
				
				$(hScrlinks[i]).addClass("navActiveEffect");
			}

		});

	}

			// responsive handlers

	function handleResize(){
		windowWidth = $window.width();
		windowHeight = $window.height();

		checkBreakpoints();

		
	}

	function smBreakpoint(){	
		toggleMainNav();
		toggleFooterMenus();
	}

	function mdBreakpoint(){
		
	}

	function lgBreakpoint(){
		
	}


		// doSessionWorkOnLoad function to do some stuff based on what's stored in the session storage

	function doSessionWorkOnLoad(){
		reopenSkillsLists();
		if(!location.hash.length){
			scrollBackToLastPosition();
		}

	}

	function handleTouchend(){

		rerenderFixedElements();

		return;

		touchJustEnded = true;

		if(touchendTimeout){
			clearTimeout(touchendTimeout);
		}

		var touchendTimeout = setTimeout(function(){
			touchJustEnded = false;
		},2000);



	}


						/*
							minor callbacks
						*/

		// function to expand skills list
	function expandListFunc(args){
		var $this = $(this);
		
		var listOrderDesc = args.listOrderDesc,
			listContainer = args.listContainer,
			listHeight = args.listHeight,
			arrow = args.arrow,
			initialHeightOfListOrderDesc = args.initialHeightOfListOrderDesc;


		TweenLite.to(listContainer,1,{
			height: (listHeight + 100) + "px",
			onComplete: completed
			
		});

		function completed(){
			TweenLite.set(listContainer,{
				'will-change': 'auto'
			});

			setTimeout(function(){
				getTopOffsetsForHeaderScrollLinks();
			},500);
		}

		/*TweenLite.to(listContainer,0,{
			height: (listHeight + 100) + "px",
			ease: Power2.easeOut,
			onComplete: getTopOffsetsForHeaderScrollLinks
			
		},"listExpanded");*/

		/* ---------------------- */

		// var tl = new TimelineLite();
		if (listOrderDesc.length) {
			TweenLite.set(listOrderDesc,{
				autoAlpha: 1,
				height: initialHeightOfListOrderDesc
			});
		}

		TweenLite.set(listContainer,{
			className: '+=expanded'
		});
		/*TweenLite.fromTo(arrow,.9,{
			autoAlpha:.5,
			scaleY: 0
		},{
			autoAlpha:1,
			scaleY: 1
		}); */

		if (arrow.length) {
			TweenLite.fromTo(arrow,.9,{
				autoAlpha:.5,
				scaleY: 0
			},{
				autoAlpha:1,
				scaleY: 1
			}); 
		}

		TweenLite.to($this,.3,{
			rotation: 180
		});	
	}	

		// function to collapse skills list
	function collapseListFunc(args){
		var $this = $(this);

		var listOrderDesc = args.listOrderDesc,
			listContainer = args.listContainer,
			listHeight = args.listHeight,
			arrow = args.arrow;


		TweenLite.to(listContainer,.3,{
			height: listHeight + "px",
			ease: Power2.easeOut,
			onComplete: completed
		});

		function completed(){
			TweenLite.set(listContainer,{
				'will-change': 'auto'
			});

			setTimeout(function(){
				getTopOffsetsForHeaderScrollLinks();
			},500);
		}			

		/* -------------------- */
		if (listOrderDesc.length) {
			TweenLite.set(listOrderDesc,{
				autoAlpha: 0,
				height: 0
			});
		}

		TweenLite.set(listContainer,{
			className: '-=expanded'
		});

		
		if (arrow.length) {
			TweenLite.to(arrow,.4,{
				autoAlpha:0,
				scaleY: 0
			}); 
		}

		TweenLite.to($this,.2,{
			rotation:0
		})
	}


	function toggleMainNav(){
		// toggle header menus : main--nav
		toggle({
			nav: headerNavMain,
			openButton: headerPullIcons,
			closeButton: headerPushIcons,
			events:'click',
			inverseButtonAppearance: true,
			effects: {
				open: function(elements){

					TweenLite.to(elements.nav,.7,{
						yPercent: "0",
						ease: Power4.easeOut
					});
					TweenLite.to(elements.$this,.3,{
						autoAlpha: 0
					});
					TweenLite.to(elements.visibleBtn.add(elements.listContainer),.3,{
						autoAlpha: 1
					});
					
				},
				close: function(elements){

					TweenLite.to(elements.nav,.7,{
						yPercent:"-105",
						ease: Bounce.easeOut
					});

					TweenLite.to(elements.$this.add(elements.listContainer),.3,{
						autoAlpha:0
					});

					TweenLite.to(elements.visibleBtn,.3,{
						autoAlpha: 1
					});
					
				}
			}
		});
	}

	function toggleFooterMenus(){
		// toggle footer menu - secondary nav

		toggle({
			nav: secondaryNav,
			openButton: secondaryNavOpen,
			closeButton: secondaryNavClose,
			events:'click',

			effects: {
				open: function(elements){
					console.log(elements);
					TweenLite.to(elements.nav,.7,{
						yPercent: "-105",
						ease: Power4.easeOut
					});
					TweenLite.to(elements.$this,.3,{
						autoAlpha: 0
					});
					TweenLite.to(elements.visibleBtn.add(elements.list),.3,{
						autoAlpha: 1
					});
					
				},
				close: function(elements){

					TweenLite.to(elements.nav,.7,{
						yPercent:"0",
						ease: Bounce.easeOut
					});
					TweenLite.to(elements.$this.add(elements.list),.3,{
						autoAlpha:0
					});

					
					TweenLite.to(elements.visibleBtn,.3,{
						autoAlpha: 1
					});

					
					
				}
			}

		});

		// toggle footer menus - social nav

		toggle({

			nav: socialNav,
			openButton: socialNavOpen,
			closeButton: socialNavClose,
			events:'click',
			effects: {
				open: function(elements){
					console.log('elements');
					console.log(elements);
					TweenLite.to(elements.nav,.7,{
						yPercent: "-105",
						ease: Power4.easeOut
					});
					TweenLite.to(elements.$this,.3,{
						autoAlpha: 0
					});
					TweenLite.to(elements.visibleBtn.add(elements.list),.3,{
						autoAlpha: 1
					});
					
				},
				close: function(elements){

					TweenLite.to(elements.nav,.7,{
						yPercent:"0",
						ease: Bounce.easeOut
					});
					TweenLite.to(elements.$this.add(elements.list),.3,{
						autoAlpha:0
					});

					
					TweenLite.to(elements.visibleBtn,.3,{
						autoAlpha: 1
					});

					
					
				}
			}
		});
	}





			/****************************

				=self attaching (invoking themselves and the functions) handlers
			
			****************************/

			
			// primary contact form
	function contact(){

		var 
		cf = contactForm, 
		fields = cfAllFields, // all form fields
		inputs = cfInput, // all inputs
		selects = cfSelectBoxes, // all selects
		purpose = cfPurpose, // purpose select box
		textareas = cfTextarea, // all textareas
		submit = cfSubmit // submit button
		;

		var submitSpinner = cf.find('.cf-spinner');



		/* FORM FOCUS EVENTS  */

		fields.on("focus",function(e){
			var $this = $(this),
			placeholderText = $this.attr("data-placeholder");

			$this.addClass("focused");
			

			if (e.target.tagName=="SELECT") {
				var itsSelect = true;
				var option = $this.find('.default');
				var customText = option.data("custom-text");
				var selectText;

				if (customText && customText != "") {
					selectText = customText + selectHelpText;	
				}else{
					selectText = selectDefaultText + selectHelpText;	
				}
				option.html(selectText);

			}else{
				$this.attr('placeholder',placeholderText );
			}
			
			// on focus out

			$this.one('blur',function(e){
				var value = $.trim($this.val());		

				if (value == "") {
					$this.removeClass("focused");
				}

				if (itsSelect) {
					option.html(selectNullText);
				}else{
					$this.attr('placeholder',placeHolderDefault);
				}

			});

		});

		// on change 
		purpose.on('change',function(e){
			var $this = $(this);
			var pick, pickFrom, pickDefault, textareaPlaceholder, submitBtnText,
			selectedOption;

			/*if (e.target.tagName=="SELECT") {
				var itsSelect = true;
			}else{ return;  } // return early*/
			
			selectedOption = $.trim($this.val());
			pick = selectedOption ? selectedOption : 'default'; // select default prop inside purposeAlts if nothing is selected
			pickFrom = purposeAlts[pick] || purposeAlts['default']; // pick the prop (object) from purposeAlts
			pickDefault = purposeAlts['default'];// pick the default prop from purposeAlts
			
			textareaPlaceholder = pickFrom['textareaPlaceholder'] || pickDefault['textareaPlaceholder']; // if textarea placeholder is not given in one of them use from the default prop
			submitBtnText = pickFrom['submitBtnText']; // select the submit button text

			// change textarea placeholder (data attribute which is used when it's focused)
			textareas.eq(0).attr('data-placeholder',textareaPlaceholder);
								
			// change submit button text
			submit.text(submitBtnText);
				
		});

		/* FORM FOCUS EVENTS END */



	
		/* FORM SUBMISSION AND VALIDATION */

		function contactFormSubmission(){

			var email = inputs.filter('[type="email"]');

				
				// change validation messages and other options 
			
			cf.parsley({
				requiredMessage: cfReqText
				
			});

			fields.each(function(){
				var $this = $(this),
				closestFieldBlock = $this.closest('.field-block');

				$this.parsley({
					errorsContainer: function () {
						return closestFieldBlock; // change validation message container 
					}
				});

			});

						
			email.parsley({
				typeMessage: cfMailText
	        	// noFocus: true
			});


			// act to validation errors and success on submission

			cf.parsley().on('form:error',function(){

			    console.log('validation errors');  

			}).on('form:submit',function(e){
			    // write code below to process contact form on server side 
			    
			    // tip: form element is cached in variable (and every field as well)
			    // above as ` var cf  `

			    var formData = cf.serialize();

			    if ($.trim(formData) == '') {
			    	alert('error occured in script');
			    }else{

				     $.ajax({
				        url: 'controller/cf-submit.php',
				        type: 'post',
				        dataType: 'json',
				        data: formData
				    }).done(success).fail(fail);
			    	
			    }

			               
			    disableFormForProcessing();	// give user feedback to let them wait

			    return false;  // stop page reload 
			});


			var formAlert = new generalModalHandler();

			var formAlertOpts = {
				template: alertTemplate,
				content: {
					'message': '',
					'highlight': ''
				},
				el:{
					lightbox: {
						on: true,
						class: 'lightbox--form-alert'
					},/*
					container: {
						on: true,
						class: 'alert-container'
					},*/
					modal: {
						class: 'alert alert--form ',
						selector: '.alert',
						autoHide: true,
						fadeOutBuffer: 5000
					},
					context: wrap
				},
				animateIn: {
					modal:{
						props:{
							autoAlpha: 1,
							scale: 1,
							rotationX: 0,
							ease: Back.easeOut.config(1.4)
						},
						duration: 600
					},/*
					container: {
						props:{
							autoAlpha: 1
						},
						duration: 0
					},*/
					lightbox: {
						props:{
							autoAlpha: 1
						},
						duration: 300
					}
				},
				
				animateOut: {
					modal:{
						props:{
							autoAlpha: 0,
							scale: .7,
							rotationX: 50,
							ease: Power2.easeIn
						},
						duration: 500
					},
					lightbox: {
						props:{
							autoAlpha: 0
						},
						duration: 200
					},
					depOnChild: true
				},

				setCss:{
					container:{
						autoAlpha: 0
					},
					modal:{
						autoAlpha: 0,
						scale: .8,
						rotationX: 50,
						transformOrigin: "50% 50%"
					}
				}
			};



			// success callback
			function success(response, textStatus, jqXHR){
            	console.log(response);

            	if (response.status) {
            		console.log('data submitted');
            		showDataSent();// run when emails were sent successfully
            	}else{
            		showDataProcessError(); // run this if emails were not sent
            	}
	          
			}



				// user response on success 

			function showDataSent(){
				var opts = $.extend({},formAlertOpts); // make a new copy of the object

				// change the message 
				opts.content.highlight = '<span class="highlight">data submitted!</span>';
				opts.content.message = 'thanks for getting in touch.<br> You will receive a confirmation mail from me in a few seconds! <br> You can also reach me through the social media channels mentioned here in the website.';
				
				// add class of success
				opts.el.modal.class += ' success';

				opts.el.modal.fadeOutBuffer = 10000;
				// show the alert
				formAlert.init(opts);
				reenableFormForProcessing();

			
			}

				// user response on success but data processing error in the backend
			
			function showDataProcessError(){

				var opts = $.extend({},formAlertOpts); // make a new copy of the object

				// change the message

				opts.content.highlight = '<span class="highlight">processing error!</span>';
				opts.content.message = 'please contact me directly on my email-address, <a href="mailto:contact@vimalpatra.com"> contact@vimalpatra.com </a> or through my social media channels.';
				
				// add class of success
				opts.el.modal.class += ' error';
				
				opts.el.modal.fadeOutBuffer = 10000;

				// show the alert
				formAlert.init(opts);
				reenableFormForProcessing();

			}



			// fail callback
			function fail(jqXHR, textStatus, error){
            	console.log(error);
            	showSubmitFailed();
			}


				// user response on failure 

			// run if the form was not submitted
			function showSubmitFailed(){

				var opts = $.extend({},formAlertOpts); // make a new copy of the object

				// change the message 
				
				opts.content.highlight = '<span class="highlight">error occured!</span>';
				opts.content.message = 'please contact me directly on my email-address, <a href="mailto:contact@vimalpatra.com"> contact@vimalpatra.com </a>.<br> you can also take a screenshot of the error and attach that in your mail';

				// add class of success
				opts.el.modal.class += ' error';
				
				opts.el.modal.fadeOutBuffer = 12000;

				// show the alert
				formAlert.init(opts);

				reenableFormForProcessing();

			}


			var changeText, tm;


			// user response - form disabled for processing
			function disableFormForProcessing(){

				// disable the form
				TweenLite.set(fields.add(submit).add(submitSpinner),{
					attr: {
						'disabled': 'true'
					},
					className: '+=disabled'
				});
				
				// change the button text and
				changeText = TweenLite.to(submit,1,{
					text: {
						value: cfSubmitWaitText,
						delimiter: ''
					}
				});

				console.log(submitSpinner);
				// animate the spinner
				tm = TweenMax.to(submitSpinner,.4,{
					rotation: 360,
					repeat: -1
				});

			}


				// user response - form disabled for processing
			function reenableFormForProcessing(){

				cf[0].reset();

				fields.removeClass('focused');

				// disable the form
				TweenLite.set(fields.add(submit).add(submitSpinner),{
					className: '-=disabled'
				});

				fields.add(submit).add(submitSpinner).removeAttr('disabled');
				
				// Revert to the original button text
				if(changeText){
					changeText.progress(0).pause();
				}

				tm.kill();

			}
			
		}

		contactFormSubmission();


		

		/* FORM SUBMISSION AND VALIDATION ENDS*/
	}

			// toggle mobile nav menu
	function toggleMobMainNav(){
		// toggle header menus : main-nav--mob
		toggle({
			nav: headerMobNavMain,
			openButton: headerMobPullIcons,
			closeButton: headerMobPushIcons,
			events:'click',
			inverseButtonAppearance: false,
			closeOnLinkClick: true,
			effects: {
				open: function(elements){
					console.log(elements);
					TweenLite.to(elements.el,.7,{
						autoAlpha: 1,
						ease: Power4.easeOut
					});
					TweenLite.to(elements.$this,.3,{
						autoAlpha: 0
					});
					TweenLite.to(elements.visibleBtn,.3,{
						autoAlpha: 1
					});
					
				},
				close: function(elements){
					console.log(elements);
					TweenLite.to(elements.el,.7,{
						autoAlpha: 0,
						ease: Power4.easeOut
					});

					if(!elements.anchorPressed){
						TweenLite.to(elements.$this,.3,{
							autoAlpha:0
						});
					}

					TweenLite.to(elements.visibleBtn,.3,{
						autoAlpha: 1
					});
					
				}
			}
		});
	}

			// hash scrolling handlers
	function hashScroll(){
		scrollingLinks.on("click",function(){
			var $this = $(this),
			duration = 1,
			easing = 'Power2.easeOut', 
			scrollToPoint = $this.data("hash_scroll_to");

			if ($this.hasClass("link--go-to-top")) {
				duration = 5;

				var maxScrollTop = documentHeight - windowHeight,
				scrollFactor = (scrollPos / maxScrollTop).toFixed(2);

				duration *= scrollFactor;
				easing = "Linear.easeNone";

			}
			// var toPoint = type of ($this.data("hashScrollTo")) ? 
			TweenLite.to(scrollingContainer, duration, {scrollTo:scrollToPoint,ease:'Power2.easeOut'});
			
			if (scrollToPoint == undefined) { console.log("data-hash_scroll_to is not defined")}
		});
	}
	


	


			// modal handler
	var model_objects_proto = function(obj){
		var type = obj.type;
		this.type = type;
	};
	var model = {};

	model.getAQuote = new model_objects_proto({
		type: "html"
	});
	model.getAQuote.content = "getAQuoteTemplate";

	model.viewCaseStudy = new model_objects_proto({type:"html"});
	model.viewCaseStudy.content = '<div class="message message--sorry">sorry case studies are not added yet. I am working on it but it will take time as i am working with my team on some other projects. Check back soon in a couple weeks. :></div>';
	model.getAQuote.content = '<div class="message message--sorry">sorry this part is being developed. For now youcan head over to the contact section to get a quote directly from me.</div>';


			// helpbox handler
	function helpbox(){

		var model = {
			skillsImprovingUpon: "These are the skills which i would say that i am still grasping on while working with them on real projects to be if not perfect, atleast be very comfortable with them "
		,	futureSkills: "These are the technologies which i have an eye on and as soon as my scheduled allows me for it i'll be picking up from one of these to learn & work on. "
		};
		var lightboxForHelpbox;
		var template;
		var templateCounter = 0;

		var helpAdder = {
			init:function(){
				var self = helpAdder;
				self.$this = $(this);
				self.lightbox = lightboxForHelpbox;
	
				var helpboxSubjectElem = self.$this.siblings(".helpbox__subject");
				self.helpboxSubject = helpboxSubjectElem.text();

				if (!self.helpboxSubject.length){
					self.helpboxSubject = self.$this.data("helpbox_subject");
					if (self.helpboxSubject == undefined) {
						alert("sorry nothing available for this button");
						return;
					}
				}

				// alert(self.helpboxSubject);
				self.replaceData.call(self);
				self.addBox.call(self);
				
			},

			replaceData:function(){
				var self = this;
			
				var dataText = self.$this.data("bind");
				// alert("here");
				// alert(self.helpboxSubject);
				
				self.text = model[dataText];


				if (!template) {	
					template = helpboxTemplate;
				}else if (template && templateCounter == 0){
					template = $(template.html());
					templateCounter++;
			
				}
				self.helpboxHTML = 
						template.html()
							.replace("%subject%",self.helpboxSubject)
								.replace("%text%",self.text)
									.replace("%other%","");

				// alert(template.html());

			},
			addBox: function(){

				var self = this;		
				if (wrap.children('.lightbox--helpbox').length== 0) {
					// alert("0");

					self.lightbox = $("<div></div>",{
						"class": "lightbox lightbox--helpbox"
					});
					self.lightbox.append(self.helpboxHTML);
					wrap.append(self.lightbox);
					TweenLite.set(self.lightbox,{
						autoAlpha:0
					});

					self.helpbox = self.lightbox.find("#helpbox");
					
					setTween();
					animateIn();

				}else if(wrap.children('.lightbox--helpbox').length== 1){
					// alert("1");
					self.helpbox.html(self.helpboxHTML);
					setTween(2);
					animateIn();
				}
				else{
					alert("there  is already one");
				}
				
				function setTween(multiplier){
					if (!multiplier) {multiplier = 1}
					TweenLite.set(self.helpbox,{
						autoAlpha:0,
						rotationX:-30,
						yPercent: "-="+ (multiplier * 100) +"%"
					});
				}
				function animateIn(){
					var tl = new TimelineLite();
					tl.to(self.lightbox,.3,{
						autoAlpha:1
					}).to(self.helpbox,.7,{
						autoAlpha:1,
						rotationX:0,
						yPercent: "+=100%",
						ease: Back.easeOut.config(0.9)
					});
					lightboxForHelpbox = self.lightbox;
				}
				
				self.removeBox.call(self);

			},
			removeBox: function(){
				var self = this;
				var close = self.helpbox.find(".close");
				close.on("click",removeLightbox);

				self.lightbox.on("click",removeLightbox); // lightbox event handler
				self.helpbox.on("click",function(e){	e.stopPropagation();	}); // disabling lightbox handler inside the helpbox itself

				function removeLightbox(){
					// self.lightbox.remove();
					var tl = new TimelineLite();
					tl.to(self.helpbox,.5,{
						autoAlpha:.5,
						yPercent: "+=100%",
						rotationX:30,
						ease: Back.easeIn.config(0.9)
					}).to(self.lightbox,.2,{
						autoAlpha:0
					});

				}

			}
		}

		helpboxBtn.on("click",helpAdder.init);

	}

	function modal(){
		

		var lightboxForModal;
		var template;
		var templateCounter = 0;

		var modalAdder = {
			init:function(){
				var self = modalAdder;
				self.$this = $(this);
				self.lightbox = lightboxForModal;
				
	
				self.modalTitle = self.$this.data("modal_title");

				if (self.modalTitle == undefined) {
					
					self.modalTitle = self.$this.text();
					// alert($this.text());
					if (!self.modalTitle.length){
						alert("sorry nothing available for this button");
						return;
					}
				}
				

				self.replaceData.call(self);
				self.addBox.call(self);
																/*continue*/
				// alert(helpboxHTML);
				// alert((/^%[\s\S]*%$/gm).test(helpboxHTML));
				// console.log(helpboxHTML);
				
			},

			replaceData:function(){
				var self = this;
				var dataBind = self.$this.data("bind");
				var contentType,content;

				if (dataBind) {
					contentType = model[dataBind]["type"];
				}else{console.log(dataBind)}


				if (contentType == "template") {
					var scriptTemplateId = model[dataBind]["content"];
					content = $("#"+scriptTemplateId).html();
					console.log(content);

				}else if (contentType == "html") {
					content = model[dataBind]["content"];
					console.log(content);
				}else{alert(contentType); content = '<div class="message message--sorry">sorry there\'s no content for this button, please report this to me asap on mail@vimalpatra.com </div>'}



				if (!template) {    
                    template = modalTemplate;
                }else if (template && templateCounter == 0){
                    template = $(template.html());
                    templateCounter++;
                }

				self.modalHTML = 
					template.html()
							.replace("%title%",self.modalTitle)
								.replace("%data%",content);


			},
			addBox: function(){
				var self = this;
				if (wrap.children('.lightbox--modal').length == 0) {
                    // alert("0");
					self.lightbox = $("<div></div>",{
                        "class": "lightbox lightbox--modal"
                    });
                    self.lightbox.append(self.modalHTML);
                    wrap.append(self.lightbox);
                    TweenLite.set(self.lightbox,{
                        autoAlpha:0
                    });

                    self.modal = self.lightbox.find("#modal");
                    console.log(self.modal);
                    setTween();
                    animateIn();
				}else if (wrap.children('.lightbox--modal').length== 1) {
					// alert("1");
                    self.modal.html(self.modalHTML);
                    setTween(2);
                    animateIn();
				}else{
                    alert("there  is already one");
                }

                function setTween(multiplier){
                    TweenLite.set(self.modal,{
                        visibility:"hidden",
                        rotationX: -50,
                        rotationY: -70,
                        z:100
                    });
                }

                function animateIn(){
                    var tl = new TimelineLite();
                    tl.to(self.lightbox,.3,{
                        autoAlpha:1
                    }).to(self.modal,1,{
                        visibility:"visible",
                        rotationX: 0,
                        rotationY: 0,
                        force3D:true,
                        z:0,
                        ease: Back.easeOut.config(0.9)
                    });
                    lightboxForModal = self.lightbox;
                }

				self.removeBox.call(self);
			
			},
			removeBox: function(){
				var self = this;
				var close = self.modal.find(".close");

				close.on("click",removeLightbox);

				self.lightbox.on("click",removeLightbox);	// lightbox event handler
				self.modal.on("click",function(e){	e.stopPropagation();	}); // disabling lightbox handler inside the helpbox itself

				function removeLightbox(){
					// self.lightbox.remove();
                    var tl = new TimelineLite();
                    tl.to(self.modal,.7,{
                        rotationX: 50,
                        rotationY: 70,
                        force3D:true,
                        z:-500,
                        ease: Back.easeIn.config(0.9)
                    }).to(self.lightbox,.4,{
                        autoAlpha:0
                    },"-=.2").set(self.modal,{
                    	visibility:"hidden"
                    });
				}

			}
		}

		modalLinks.on("click",modalAdder.init);
	}
	
	/*function notifications(){
		var notifications = new generalModalHandler();

		var notificationOptions = {
			template: notiTemplate,
			content: {
				'message': 'hi there this is a notification',
				'newthing': 'old shite',
				'nice': 'maybe nice',
				'number': 3
			},
			el:{
				lightbox: {
					on: true,
					class: 'noti-lightbox'
				},
				container: {
					on: true,
					class: 'notification-container'
				},
				modal: {
					selector: '.notification',
					multipleOn: true,
					autoHide: true,
					fadeOutBuffer: 5000
				},
				context: wrap,
				parent: undefined
			},
			animateIn: {
				modal:{
					props:{
						visibility: 'visible',
						opacity: 1
					},
					duration: 500
				},
				container: {
					props:{
						autoAlpha: 1
					},
					duration: 0
				},
				lightbox: {
					props:{
						autoAlpha: 1
					},
					duration: 500
				}
			},
			
			animateOut: {
				modal:{
					props:{
						autoAlpha: 0,
						Y: 0
					},
					duration: 500
				},
				container: {
					props:{
						autoAlpha: 0
					},
					duration: 0
				},
				lightbox: {
					props:{
						autoAlpha: 0
					},
					duration: 300
				},
				depOnChild: true,
				parentFadeDelay: 2000
			},

			setCss:{
				container:{
					autoAlpha: 0
				},
				modal:{
					autoAlpha: 0
				}
			}
		};

		notifications.init(notificationOptions);
	}*/
	

	


	toggleMobMainNav();
	contact();
	hashScroll();
	helpbox();
	modal();
	// notifications();




				/****************************

				=integral functions	(used internally from other functions or used for some integral feature)
						 
				// just need to be called when we need it without any params

				****************************/




	function checkLocalStorage(){

		var visit = {
			"count": 1,
			"time": Date.now()
		};

		var visitFromLS = localStorage.getItem("visit");

		// if visit has not been set set it as a new visit object 
		// or else update the count

		if (!visitFromLS) {
			localStorage.setItem("visit", JSON.stringify(visit));

		}else{
			visitFromLS = JSON.parse(visitFromLS);

			visitFromLS.count++;
			localStorage.setItem("visit", JSON.stringify(visitFromLS));

			// if more than a day has passed since the user visited then reset the visit count and third visit thing
			var storedDate = new Date(visitFromLS.time).getDate(); 
			var currentDate = new Date().getDate(); 

			if (visitFromLS.count > 2 || storedDate + 1 >= currentDate) {
				localStorage.setItem("trim-animation","true");

			}else if(storedDate + 1 < currentDate) {
				
				localStorage.setItem("trim-animation","false");
				localStorage.setItem("visit", JSON.stringify(visit));
			
			}


		}

	}



	// dealing with the loader

    var 
    loader = $('#loader'),
    loaderContainer = loader.find('.container'),
    loaderContent = loaderContainer.find('.content'),
    loaderSpinner = loaderContainer.find('.spinner'),
    loaderMessage = loaderContainer.find('.message'),
    appendAtLast = loaderContainer.find('.append')
    ;

    var 
    tl = new TimelineLite(),
    tl2 = new TimelineLite()
    ;

    TweenLite.set(appendAtLast,{
    	autoAlpha: 0
    })
    appendAtLast.html('visit my blog on <a target="_blank" href="http://vimalpatra.com/blog">vimalpatra.com/blog</a> ');
	

	function loadingAnimations(){
		var trimAnimation = JSON.parse(localStorage.getItem("trim-animation"));
		console.log('trimAnimation');
		console.log(trimAnimation);
		console.log(typeof trimAnimation);

		var change = [
			'hire me',
			'Read My stories'
		];

		tl.to(loaderContent,.5,{
			autoAlpha: 0
		}).to(loaderContent,.5, {
			height: 0,
			ease: Power3.easeOut,
			onComplete: trimAnimation != true ? changeMessage : complete
		},'-=.2');


		var i = 0;
		
		function changeMessage(){

			console.log('i before ++');
			console.log(i);

			tl.set(loaderMessage, {
				autoAlpha: 0,
				y: 20
			}).to(loaderMessage,0,{
				text: {
					value: change[i++],
					delimiter: ' '
				}
			}).to(loaderMessage, .65,{
				autoAlpha: 1,
				y: 0,
				ease: Power4.easeOut,
				onComplete: complete
			});
		}

		function complete(){
			var waitForLoaderToFade = 1;

			if (trimAnimation != true) {
				waitForLoaderToFade = 1.5;
			}

			if (i < change.length && trimAnimation != true) {
				changeMessage();
			}else{
				tl2.to(appendAtLast,.5,{
					autoAlpha: 1
				}).to(loader,.5,{
					autoAlpha: 0,
					y: -50
				},'+=' + waitForLoaderToFade);
			}
		}

		
	}



		// scrollBackToLastPosition function to scroll back to the last cached function
	function scrollBackToLastPosition(){
		var scrollToDefault = sessionStorage.getItem("lastScrollPos");
		if (scrollToDefault) {
			TweenLite.to(scrollingContainer, 1, {scrollTo:{y:scrollToDefault},ease:Power2.easeOut});	
		}
	}

		// reopenSkillsLists function to open the last opened skills lists 
	function reopenSkillsLists(){

		if (!sessionStorage.getItem("skillsListToggleStatus")) { return; }

		skillsListToggleStatus = JSON.parse(sessionStorage.getItem("skillsListToggleStatus"));
		// var OpenSkillsListFor = [];

		Object.keys(skillsListToggleStatus).forEach(function(id){

			if (!skillsListToggleStatus[id]) {

			}else{

			}
			console.log('skillsListToggleStatus[id]');
			console.log(skillsListToggleStatus[id]);
			var element = $("#"+id),
				expand = element.find(".expand"),
				arrow = element.find(".arrow"),
				listOrderDesc = element.find(".list__order__desc"),
				initialHeightOfListOrderDesc = listOrderDesc.outerHeight(),
				technologyList = element.find(".technologyList"),
				listHeight = technologyList.height();

		
			// alert(technologyList.height());
			if (!initialHeightOfListOrderDesc) {
				initialHeightOfListOrderDesc = 0;
			}

			expandListFunc.call(expand,{
				listContainer: element,
				listHeight: (listHeight + initialHeightOfListOrderDesc),
				listOrderDesc: listOrderDesc,
				arrow: arrow,
				initialHeightOfListOrderDesc: initialHeightOfListOrderDesc
			});

		});
	}

		// checkBreakpoints function to run on resize and load
	var smBreakpointInitiated = false,	mdBreakpointInitiated = false,	lgBreakpointInitiated = false;
	
	function checkBreakpoints(){

		if (windowWidth >= 768) {
			// smBreakpointInitiated = true;
			smBreakpoint();
			console.log('sm breakpoint reached');

			if (windowWidth >= 992) {
				// mdBreakpointInitiated = true;
				mdBreakpoint();
				console.log('md breakpoint reached');

				if (windowWidth >= 1200) {
					// lgBreakpointInitiated = true;
					lgBreakpoint();	
					console.log('lg breakpoint reached');

				}/* check if window is larger than 1200 and if lg breakpoint has ran earlier*/

			}/* check if window is larger than 992 and if md breakpoint has ran earlier*/

		}/* check if window is larger than 768 and if sm breakpoint has ran earlier*/
	}	/* checkBreakpoints function */


	function getTopOffsetsForHeaderScrollLinks(){
		scrollPositionOfHashLinks = [];
		var headerScrollLinks = $(headerNavMain[0]).find('.link--scroll');

		headerScrollLinks.each(function(i,elem){
			var $this = $(elem),
			scrollsToElementId = $this.data("hash_scroll_to");
		
			var elementItself = $(scrollsToElementId);

			var addToOffset = -0; // add further pixels to scroll down to the offset of the element 

			var offsetTopForElement= Number((elementItself.offset().top + addToOffset).toFixed(2)); // -1 for fixing the precision error
			scrollPositionOfHashLinks.push(offsetTopForElement);

			// console.log(elementItself);
	
		});
		console.log('scrollPositionOfHashLinks-- new');
		console.log(scrollPositionOfHashLinks);
	}

	getTopOffsetsForHeaderScrollLinks();


	

	function rerenderFixedElements(){		
		var fixed = fixedElements;
		fixed.replaceWith(fixed);
			
	}


				/****************************
						=utility functions 

				(callables to make use of a functionality using different params, using plugin like api)
				
				****************************/


		// toggle function to toggle menus in header and footer menus
	function toggle(options){
		var openBtn, closeBtn;

		if (!options.openButton && !options.closeButton) {
			return console.log('no toggle buttons provided');
		}

		options.effects.defaults = {};
		openBtn = options.openButton;
		closeBtn = options.closeButton;	

		

		if (options.inverseButtonAppearance) {
			TweenLite.set(openBtn,{autoAlpha:0});

		}else{
			TweenLite.set(closeBtn,{autoAlpha:0});

		}


		if (!options.events) {
			options.events = 'click';
		}

		var dataToggle = openBtn.data("toggle") ||  closeBtn.data("toggle");
		var el = wrap.find(dataToggle);
		var nav = options.nav; 
		var listContainer = nav.find('.list-container');
		var list = nav.find('.list');
		var anchors = options.closeOnLinkClick ? options.nav.find('a').not('.stay') : undefined;

		

		openBtn.on(options.events,function(){
			var $this = $(this);
			var visibleBtn = $this.attr("data-function") != 'close' ? closeBtn : openBtn;		
			console.log('obbject');
			console.log({
				dataToggle: dataToggle,
				el: el,
				nav: nav,
				listContainer: listContainer,
				list: list,
				anchors: anchors
			});

			options.effects.defaults.open = function(){
				var tl = new TimelineLite();

				tl.set(listContainer,{
					"display":"block"
				}).to($this,.3,{
					autoAlpha: 0
				});

				TweenLite.to(visibleBtn.add(listContainer),.3,{
					autoAlpha: 1
				});
			}

			if (options.effects) {
				if (options.effects.open && typeof options.effects.open == 'function') {
					options.effects.open({
						nav: nav,
						el: el,
						list: list,
						visibleBtn: visibleBtn,
						$this: $this,
						listContainer: listContainer
					});

				}else{
					console.log("No function passed for effects.open, running the defaults");
					options.effects.defaults.open();
				}
			
			}else{
				console.log("No object passed for effects");
				options.effects.defaults.open();
			
			}

		});


		closeBtn.on(options.events,function(){
			var $this = $(this);
			var visibleBtn = $this.attr("data-function") != 'open' ? openBtn : closeBtn;

			console.log('obbject');
			console.log({
				dataToggle: dataToggle,
				el: el,
				nav: nav,
				listContainer: listContainer,
				list: list,
				anchors: anchors
			});


			options.effects.defaults.close = function(){
				var tl = new TimelineLite();
				tl.to($this.add(listContainer),.3,{
					autoAlpha:0
				}).set(listContainer,{
					"display":"none"
				});

				TweenLite.to(visibleBtn,.3,{
					autoAlpha: 1
				});
			}

			if (options.effects) {
				if (options.effects.close && typeof options.effects.close == 'function') {
					options.effects.close({
						nav: nav,
						el:el,
						list: list,
						visibleBtn: visibleBtn,
						$this: $this,
						listContainer: listContainer
					});
				}else{
					console.log("No function passed for effects.close, running the defaults");			
					options.effects.defaults.close();
				}
			}else{
				console.log("No object passed for effects");	
				options.effects.defaults.close();
			}
	
		});


		if (options.closeOnLinkClick) {

			anchors.on(options.events,closeWithLink);
			
			function closeWithLink(){
				var $this = $(this);
				var visibleBtn = $this.attr("data-function") != 'open' ? openBtn : closeBtn;

				
				if (options.effects) {
					if (options.effects.close && typeof options.effects.close == 'function') {
						options.effects.close({
							nav: nav,
							el:el,
							list: list,
							anchorPressed: true,
							visibleBtn: visibleBtn,
							listContainer: listContainer
						});

					}else{
						console.log("No function passed for effects.close, running the defaults");			
						// options.effects.defaults.close();
					}
				}else{
					console.log("No object passed for effects");	
					// options.effects.defaults.close();
				}
			}

		}
	}

		// function to create any kind of popup / modal / notification / alert (depends on jq and gsap)
	function generalModalHandler(){
	
		var _lightbox, _container, _modal, _oldModal, _template, initialized
		;

		var modalAdder = {
			init:function(obj){
				var self = modalAdder;
				self.$this = $(this); // event target

				//options 
				self.contextEl = obj.el.context; // *context in which we start looking the outer most element when added
				self.parentEl = obj.el.parent; // parent in which we append the outer most element
				
				self.template = obj.template; //* template for the modal 
				self.content = obj.content; // content (if you need to replace the content inside)

				if (obj.el.lightbox) {
					self.lightboxOn = obj.el.lightbox.on; // lightbox is on or not
					self.lightboxClass = obj.el.lightbox.class; // lightbox's class (* if lightbox on)		
				}

				if (obj.el.container) {
					self.containerOn = obj.el.container.on; // container is on or not
					self.containerClass = obj.el.container.class; // container's class (* if lightbox on)	
				}

				// modal is the actual thing that you provide from template (the actual popup or alert)
				if (obj.el.modal) {
					self.modalSelector = obj.el.modal.selector; //* the actual modal's selector class inside the template you provide
					self.modalClass  = obj.el.modal.class;
					self.modalAutoHide = obj.el.modal.autoHide; 
					self.modalFadeOutBuffer = obj.el.modal.fadeOutBuffer; 
					self.modalMultipleOn = obj.el.modal.multipleOn; // if we need multiple modals to be shown at the same time (for eg: toasts)
				}

				if (obj.setCss) {

					self.setCssForLightBox = obj.setCss.lightbox; // css rules to be set for the lightbox before we start animating
					self.setCssForContainer = obj.setCss.container; // css rules to be set for the container before we start animating
					self.setCssForModal = obj.setCss.modal; // css rules to be set for modal before we start animating
					
				}

				self.animateInProps = obj.animateIn.modal.props; //* properties to be animated in for the modal if we need them
				self.animateInDuration = obj.animateIn.modal.duration; //* modal duration to be used for animating in
				self.animateOutProps = obj.animateOut.modal.props; //* properties to be animated out for the actual modal
				self.animateOutDuration = obj.animateOut.modal.duration; //* modal duration to be used for animating out
				
				if (obj.animateIn.lightbox) {
					self.lightboxAnimateInProps = obj.animateIn.lightbox.props; 
					self.lightboxAnimateInDuration = obj.animateIn.lightbox.duration; //*
				}
				if (obj.animateOut.lightbox) {
					self.lightboxAnimateOutProps = obj.animateOut.lightbox.props;
					self.lightboxAnimateOutDuration = obj.animateOut.lightbox.duration; //*
				}

				if (obj.animateIn.container) {
					self.containerAnimateInProps = obj.animateIn.container.props; 
					self.containerAnimateInDuration = obj.animateIn.container.duration; //*
				}
				if (obj.animateOut.container) {
					self.containerAnimateOutProps = obj.animateOut.container.props;
					self.containerAnimateOutDuration = obj.animateOut.container.duration; //*
				}

				self.depOnChild = obj.animateOut.depOnChild;
				self.parentFadeDelay = obj.animateOut.parentFadeDelay;  

				// replace the data which is received
				self.replaceData.call(self);

				// add box/modal
				self.addModal.call(self);

				// set tweens for everything
				self.setTweens();
				
				// animate in the box/modal
				self.animateIn();
				
				// add removing functionality	            
				self.attachFadeOutListeners.call(self); // call removeBox in order to attach handler to remove the modal
				
				initialized = true; // to not run specific things after the first time
			},

			replaceData:function(){
				var self = this,
				template = self.template,
				content = self.content,
				modalClass = self.modalClass;

				if (!template || !content) {    
                    return;
                }else{
                    template = template.html();
                    // templateCounter++;
                }

                // loop over the contents properties and replace em in the template
                Object.keys(content).forEach(function(el){
                	template = template.replace('%' + el + '%',content[el]);
                });

				self.modal = $(template); // the DOM node for the modal with whole content stored in

				self.modal.addClass(modalClass); // add extra classes that were passed
			},
			addModal: function(){
				var self = this,
				contextEl = self.contextEl,
				lightboxClass = self.lightboxClass,
				containerClass = self.containerClass,
				lightboxOn = self.lightboxOn,
				containerOn = self.containerOn,
				setCssForModal = self.setCssForModal,
				setCssForContainer = self.setCssForContainer,
				setCssForLightBox = self.setCssForLightBox,
				modal = self.modal,
				modalMultipleOn = self.modalMultipleOn,
				parentEl = self.parentEl || self.contextEl;

				// var lightbox; // these gets assigned below

				if (!contextEl || contextEl.length == 0) {
					contextEl = $('body');
				}

                // we'll use these to check to see if these elements are already created in the DOM
                // var lightboxInDOM = contextEl.find('.' + lightboxClass);
				// var containerInDOM = contextEl.find('.' + containerClass);

				if (!initialized) {
					// make these objects as jQuery objects so we don't have to refind it in DOM
					var lightboxElement = $("<div></div>",{
	                    "class": "lightbox " + (lightboxClass || "")
	                });

	                var containerElement = $("<div></div>",{
	                    "class": "container " + (containerClass || "")
	                });
				}

				if (lightboxOn && containerOn) {

					if (!_lightbox || (_lightbox && !_lightbox[0].isConnected)) {

	                    // appending elements on top of each other using appendElementsInQ func
	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	parentEl,
	                    	lightboxElement || _lightbox,
	                    	containerElement || _container,
	                    	modal
	                    ]);



					}else if (_lightbox.length == 1) {
	                   
	                    if (!modalMultipleOn) {
	                    	if (modal.length == 1) {
			                    removeOldModal();
							}
	                    }
	                    // using the global scope variables cuz it is available now
	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	_container,
	                    	modal
	                    ]);

					}else{
	                    alert("Dev Note: we are adding duplicate HTML");
	                }
				}else if (lightboxOn){
					if (!_lightbox || (_lightbox && !_lightbox[0].isConnected)) {

	                    // appending elements on top of each other using appendElementsInQ func
	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	parentEl,
	                    	lightboxElement || _lightbox,
	                    	modal
	                    ]);

					}else if (_lightbox.length == 1) {

	                	if (!modalMultipleOn) {
	                    	if (modal.length == 1) {
			                    removeOldModal();
							}
	                    }

	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	_lightbox,
	                    	modal
	                    ]);

					}else{
	                    alert("Dev Note: we are adding duplicate HTML");
	                }
				}else if (containerOn) {
					console.log('----------------');
					if (!_container || (_container && !_container[0].isConnected)) {
	                 	console.log('no container found in DOM');
	            
	                    // appending elements on top of each other using appendElementsInQ func
	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	parentEl,
	                    	containerElement || _container,
	                    	modal
	                    ]);

					}else if (_container.length == 1) {
	               		console.log('append to exisiting container');
	                    // appending elements on top of each other using appendElementsInQ func
	                    if (!modalMultipleOn) {
	                    	if (modal.length == 1) {
			                    removeOldModal();
							}
	                    }

	                    appendElementsInQ([ // need to be in 'ancestor-first' order
	                    	_container,
	                    	modal
	                    ]);

					}else{
	                    alert("Dev Note: we are adding duplicate HTML");
	                }
				}else{
					if (!modalMultipleOn && _modal.length == 1) { // modal variable is set below
		                removeOldModal();
					}

					// appending elements on top of each other using appendElementsInQ func
                    appendElementsInQ([ // need to be in order of 'ancestor-first' order
                    	parentEl,
                    	modal
                    ]);
				
				}

                
                if (!initialized) {
                	// saving to the outer scope which will be in closure when it is invoked
	                // * must be below the if checks 
		            _lightbox = lightboxElement; 
		            _container = containerElement;
	                
                }
                // modal is updated each time to the recent modal that was added
                _modal = modal;


                function appendElementsInQ(elementsArray){
                	/* running over the array appending elements functioning as if
                		the last element provided is the innermost element you want 
                		in the tree
                	*/
                	for (var i = elementsArray.length - 1; i >= 0; i--) {
                		
                		if (i) {
                			$(elementsArray[i]).appendTo(elementsArray[i-1]);
                		}
                	}

                	// converts like so...
            		/*
            		modalHTML.appendTo(containerForModal); // add modal html to container
                	containerForModal.appendTo(lightboxForModal); // add container to lightbox
                	lightboxForModal.appendTo(parentEl); // add lightbox to document
                	
                	*/
                }

                function removeOldModal(){
	            	_oldModal.remove();
	            }

                
                _oldModal = _modal; // saving it atlast if we need it on later invoking
			},
			setTweens: function(){
				var self = this,
				lightboxOn = self.lightboxOn,
				containerOn = self.containerOn,
				setCssForModal = self.setCssForModal,
				setCssForContainer = self.setCssForContainer,
				setCssForLightBox = self.setCssForLightBox;


				if ((lightboxOn && !initialized) || (_lightbox.is(':visible') || !_lightbox[0].isConnected)) {
					console.log('hey setting tweens for LB');
                	_lightbox.css('display','none'); // doing this imp
                	TweenLite.set(_lightbox,setCssForLightBox); // set css for the lightbox
                }
                if ((containerOn && !initialized) || (_container.is(':visible') || !_container[0].isConnected)) {
                	_container.css('display','none'); // doing this imp
                	TweenLite.set(_container,setCssForContainer); // set css for the container
                }

                // set base tweens/css for modal before animating
                TweenLite.set(_modal,setCssForModal);
			},
			animateIn: function(){
				var self = this,

				lightboxOn = self.lightboxOn,
				containerOn = self.containerOn,

				lightboxAnimateInProps = self.lightboxAnimateInProps,
				lightboxAnimateInDuration = self.lightboxAnimateInDuration,
				containerAnimateInProps = self.containerAnimateInProps,
				containerAnimateInDuration = self.containerAnimateInDuration,
				animateInDuration = self.animateInDuration,
				animateInProps = self.animateInProps,

				modalFadeOutBuffer = self.modalFadeOutBuffer,
				modalAutoHide = self.modalAutoHide
				;

				var tm = new TimelineMax();

				if (lightboxOn && containerOn) {
					if (!initialized || _lightbox.is(':hidden')) {
						_lightbox.add(_container).css('display','initial'); // doing this imp
						tm.to(_lightbox,lightboxAnimateInDuration/1000,lightboxAnimateInProps)
						.set(_container,containerAnimateInProps);

						console.log('this will aniamte in the lightbox');
					}

                	tm.to(_modal,animateInDuration/1000,animateInProps,'done');

				}else if (lightboxOn) {
					if (!initialized || _lightbox.is(':hidden')) {
						_lightbox.css('display','initial'); // doing this imp
						tm.to(_lightbox,lightboxAnimateInDuration/1000,lightboxAnimateInProps);
					}
                	
                	tm.to(_modal,animateInDuration/1000,animateInProps,'done');

				}else if (containerOn) {

					if (!initialized || _container.is(':hidden')) {
						_container.css('display','initial'); // doing this imp
						tm.to(_container,containerAnimateInDuration/1000,containerAnimateInProps);
					}

                	tm.to(_modal,animateInDuration/1000,animateInProps,'done');
				
				}else{
				
					tm.to(_modal,animateInDuration/1000,animateInProps,'done');
				
				}

				if (modalAutoHide) {
					// if modal auto hide is on then hide the modal after the buffer provided

					/* tm.addCallback(self.animateOut.bind(self),'done'); if we use addCallback at a label it executes right after the start of the label we want it to start in the end...*/
					tm.addCallback(self.animateOut.bind(self,_modal,self),'+=' + modalFadeOutBuffer/1000);
					
				}
			},
			attachFadeOutListeners: function(){
				var self = this,

				containerOn = self.containerOn,
				lightboxOn = self.lightboxOn,

				modalAutoHide = self.modalAutoHide,
				containerAutoHide = self.containerAutoHide,
				lightboxAutoHide = self.lightboxAutoHide,

				close = _modal.find(".close");


				if (lightboxOn) {
					_lightbox.add(close).on("click",self.animateOut.bind(self,_modal,self,true) ); // fadeout the lightbox and fadeout + remove on click (both lightbox and close)
					
				}else{
					close.on("click",self.animateOut.bind(self,_modal,self,true));	// fadeout + remove the modal on click
					
				}

				// disabling any outside handler/s inside the modal itself
				_modal.on("click",function(e){	
					e.stopPropagation();	
				}); 

			},
			animateOut: function (modal,self,forceRemove){
				
				var
				containerOn = self.containerOn,
				lightboxOn = self.lightboxOn,

				depOnChild = self.depOnChild,
				parentFadeDelay = self.parentFadeDelay,

				modalSelector = self.modalSelector,
				modalMultipleOn = self.modalMultipleOn,

				animateOutProps = self.animateOutProps,
				containerAnimateOutProps = self.containerAnimateOutProps,
				lightboxAnimateOutProps = self.lightboxAnimateOutProps,

				animateOutDuration = self.animateOutDuration,
				containerAnimateOutDuration = self.containerAnimateOutDuration,
				lightboxAnimateOutDuration = self.lightboxAnimateOutDuration

				;

				
                var tm = new TimelineMax();
                var obj = {};

                if (lightboxOn && containerOn) {

                	if (depOnChild || modalMultipleOn) {
                		tm.to(modal,animateOutDuration/1000,animateOutProps);

						obj.elem = _lightbox;
						obj.duration = lightboxAnimateOutDuration;
						obj.props = lightboxAnimateOutProps;

                	}else{
                		
                		tm.to(modal,animateOutDuration/1000,animateOutProps);
						tm.to(_lightbox,animateOutDuration/1000,lightboxAnimateOutProps);
                	}
                	

				}else if (lightboxOn) {

					if (depOnChild || modalMultipleOn) {
						
                		tm.to(modal,animateOutDuration/1000,animateOutProps);

						obj.elem = _lightbox;
						obj.duration = lightboxAnimateOutDuration;
						obj.props = lightboxAnimateOutProps;

                	}else{
                		tm.to(modal,animateOutDuration/1000,animateOutProps);
						tm.to(_lightbox,animateOutDuration/1000,lightboxAnimateOutProps);
                	}
                	

				}else if (containerOn) {
					
					if (depOnChild || modalMultipleOn) {

                		tm.to(modal,animateOutDuration/1000,animateOutProps);

						obj.elem = _container;
						obj.duration = containerAnimateOutDuration;
						obj.props = containerAnimateOutProps;

                	}else{
                		tm.to(modal,animateOutDuration/1000,animateOutProps);
						tm.to(_container,animateOutDuration/1000,containerAnimateOutProps);
                	}

				}else{
					tm.to(modal,animateOutDuration/1000,animateOutProps);
				}
				
				obj.fadeDelay = parentFadeDelay || 0;

				// adding callback after the label 'done'
				tm.addCallback(callbackFunction.bind(self,obj,forceRemove));

				// callback function which runs after animating out each modal to remove it...
				function callbackFunction(obj,force){

					modal.remove();

					if (!obj.elem){ console.log('no container element to remove'); return; }

					if (!force){
						if (modalMultipleOn && obj.elem.find(modalSelector).length) {
							console.log('mutliple modals and there are still modals present'); return;
						}
					}
					

					obj.props.onComplete = function(){
						obj.elem.remove();

						console.log('obj.elem');
                		console.log(obj.elem);
                		console.log(obj.elem[0].isConnected);
					};

					

					TweenLite.to(obj.elem, obj.duration/1000, obj.props, "+=" + obj.fadeDelay);

				}

			}

		}

		// modalLinks.on("click",modalAdder.init);
		return modalAdder;
	}

	
// Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  function throttle(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
	



	// other work
	
			// disabling default behaviours
	links.on("click",function(e){
		if (e.target.tagName=="A") { e.preventDefault(); } 
	});	

			// assigning data-hover attributes to the anchor tags that are inline
	redirLinks.each(function(i,elem){
		var $this = $(elem);
		var dataHover = $this.addClass('hover-effect').text();

		$this.attr("data-hover",dataHover);
	});


	




}());