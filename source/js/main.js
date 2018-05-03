(function(){
	"use strict";

	$(window).on("load",function(){
		var newDate = Date.now();
		console.log("time taken to load: "+ (newDate - dateNow));
		
	});
	
		// decaring variables
	var icons,
	 header, headerNavMain, headerMobNavMain, headerNavToggleIcons, headerMobNavToggleIcons,
	 headerPullIcons, headerPushIcons, headerMobPullIcons, headerMobPushIcons,
	 footerPullIcons,footerPushIcons, footerToggleIcons,
	 links, redirLinks,
	 modalLinks, disabledLinks, headerScrollLinks, scrollingLinks, scrollingLinks, scrollToTop,
	 scrollingContainer, scrollPos,
	 html, wrap, header, parallaxGroup, mainSection,
	 		/*parallaxLayers,*/ 
	 skillsLayer, technologies, listContainer, expandListContainer, technologyList, 
	 contactLayer, contactForm, 
	 cfInput, cfTextarea, cfSelectBoxes, cfAllFields,
	 cfHelpText, dataDefaultText, contactFormDefaultText,
	 windowHeight, windowWidth,
	 htmlFontSize, htmlFontSizeRem,  parallaxGroupExtraHeight, parallaxGroupMarginBottom,
	 listContainerDefaultHeight,
	 scrollPositionOfHashLinks = [],
	 helpboxBtn,
	 helpboxTemplate, modalTemplate;



	 	// scroller
	scrollingContainer = $("#parallax");
	scrollPos = 0;

		// elements
	html = $("html");
	wrap = $("#wrap");
	header = $("#header");
	parallaxGroup = scrollingContainer.find(".parallax__group");
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
	cfAllFields = cfInput.add(cfTextarea).add(cfSelectBoxes);

		// icons
	icons = $(".icon"),
	header = $('#header');
	headerNavMain = header.find('.nav--main'),
	headerMobNavMain = header.find('.mob__nav--main'),
	headerNavToggleIcons = headerNavMain.find(".icon--toggle"),
	headerMobNavToggleIcons = headerMobNavMain.find(".icon--toggle"),

	footerToggleIcons = $("footer").find(".icon--toggle"),

	headerPullIcons = headerNavToggleIcons.filter(".icon--pull"), // header's open toggle icons
	headerPushIcons = headerNavToggleIcons.filter(".icon--push"), // header's hide toggle icons

	headerMobPullIcons = headerMobNavToggleIcons.filter(".icon--pull"), // header's open toggle icons for mobiles
	headerMobPushIcons = headerMobNavToggleIcons.filter(".icon--push"), // header's hide toggle icons for mobiles

	footerPullIcons = footerToggleIcons.filter(".icon--pull"),	// footer's show toggle icons
	footerPushIcons = footerToggleIcons.filter(".icon--push"), // footer's hide toggle icons

		// links
	redirLinks = $("a").not(".link"), //  anchor tags that redirect to other pages
	links = $(".link"), // all anchors/links that leads to opening a modal or scrolling but not navigating to other page
	modalLinks = links.filter(".link--open__modal");
	headerScrollLinks = header.find(".link--scroll"),
	scrollingLinks = links.filter(".link--scroll"),	// links that link to some scroll point in the document itself 
	scrollToTop = scrollingLinks.filter(".link--go__to__top"); // scroll to top button

		//buttons

	helpboxBtn = html.find(".open__helpbox");

		// templates

	helpboxTemplate = $("script#helpboxTemplate");
	modalTemplate = $("script#modalTemplate");
	
		// font sizes and all  other rigid values that we need to get or set
	htmlFontSize = parseInt(html.css("font-size"));
	htmlFontSizeRem = htmlFontSize / 16;
	parallaxGroupExtraHeight = 100 * htmlFontSizeRem;
	parallaxGroupMarginBottom = 150 * htmlFontSizeRem;
	listContainerDefaultHeight = 150;
	dataDefaultText = "not selected";
	contactFormDefaultText = "";
	cfHelpText = " ( ↑ or ↓ to navigate / ↵ to toggle dropdown)";


	// event handlers


		// major handlers

			// unload hander
	$(window).on("unload",function(){
		// window.sessionStorage.setItem("lastScrollPos",scrollingContainer.scrollTop());
	});


			// load handler
	$(window).on("load",function(){
		// getDimensions();
		// checkBreakpoints();
		// setHeights();
		// doSessionWorkOnLoad();
		
	});

			// resize handler

	$(window).on("resize",debounce(function(){handleResize();},1000));
	function handleResize(){
		// getDimensions();
		// checkBreakpoints();
		// setHeights();
	}

			// scroll handler
	$(scrollingContainer).on("scroll",function(){
		// scrollPos = $(scrollingContainer).scrollTop();
		// requestAnimationFrame(onScroll);
	});

	


	// Event Handling functions


		// functions waiting to be invoked

				// get dimensions for all repsonsive elements in js

	function getDimensions(){
		windowWidth = $(window).width();
		windowHeight = $(window).height();
	}


				// setHeights function to set a parallax__group's height according to its content
	function setHeights(){
		mainSection.each(function(index,elem){
			var main = $(elem),
				parentGroup = main.closest(".parallax__group"),
				height = main.height(),
				top = parseInt(main.closest(".background").css("top"));	

			parentGroup.css({
				"height": height + parallaxGroupExtraHeight + top,
				"margin-bottom": parallaxGroupMarginBottom
			});

		});
	}

				// onScroll function to be invoked when scroll container is scrolled
	function onScroll(){
		var sp = scrollPos;
		var scArr = scrollPositionOfHashLinks;
		var hScrlinks = headerScrollLinks;

		$.each(scArr,function(i,el){

			if ( (sp >= el && sp < scArr[i+1]) ||  ( sp >= scArr[scArr.length - 1] )) {
				hScrlinks.removeClass("navActiveEffect");
				$(hScrlinks[i]).addClass("navActiveEffect");
			}

		});
	}

			// responsive handlers

	function smBreakpoint(){
		// toggle header menus : main--nav
		toggle({
			toggling: "main-nav",
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
					TweenLite.to(elements.visibleIcon.add(elements.listContainer),.3,{
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
					TweenLite.to(elements.visibleIcon,.3,{
						autoAlpha: 1
					});
					
				}
			},
			openButton: headerPullIcons,
			closeButton: headerPushIcons
		});

		// change extra parallax height

		parallaxGroupExtraHeight = 200 * htmlFontSizeRem;
		parallaxGroupMarginBottom = 10 * htmlFontSizeRem;
	}

	function mdBreakpoint(){
		
	}

	function lgBreakpoint(){
		
	}





			// self invoking handlers


	console.log(headerMobPullIcons);
	console.log(headerMobPushIcons);


	// toggle header menus : mob__main--nav
	toggle({
		toggling: "mobile main--nav",
		events:'click',
		effects: {
			/*open: function(elements){

				TweenLite.to(elements.nav,.7,{
					yPercent: "-105",
					ease: Power4.easeOut
				});
				TweenLite.to(elements.$this,.3,{
					autoAlpha: 0
				});
				TweenLite.to(elements.visibleIcon.add(elements.list),.3,{
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
				TweenLite.to(elements.visibleIcon,.3,{
					autoAlpha: 1
				});
				
			}*/
		},
		openButton: headerMobPullIcons,
		closeButton: headerMobPushIcons
	});


	// toggle footer menus : secondary nav and social nav
	toggle({
		toggling: "footer",
		events:'click',
		effects: {
			open: function(elements){

				TweenLite.to(elements.nav,.7,{
					yPercent: "-105",
					ease: Power4.easeOut
				});
				TweenLite.to(elements.$this,.3,{
					autoAlpha: 0
				});
				TweenLite.to(elements.visibleIcon.add(elements.list),.3,{
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
				TweenLite.to(elements.visibleIcon,.3,{
					autoAlpha: 1
				});
				
			}
		},
		openButton: footerPullIcons,
		closeButton: footerPushIcons
	});

		

	/* toggle technology list in the skills section */
	// SIAF
	function toggleTechnologyList(){
			var setTimeoutDelayForSettingHeights = 600;

			listContainer.each(function(i,elem){
				var $elem = $(elem); // listcontainer
				var technologyList = $elem.find(".technologyList");
				var listOrderDesc = $elem.find(".list__order__desc");
				var initialHeightOfListOrderDesc = listOrderDesc.height();
				var arrow = $elem.find(".arrow");
				var listHeight = technologyList.height();
				var expand = $elem.find(".expand");

				// alert(technologyList.height());
				if (!initialHeightOfListOrderDesc) {
					initialHeightOfListOrderDesc = 0;
				}

				var main = $elem.closest(".main"),
					parentGroup = main.closest(".parallax__group");

				

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


				function saveToSession(id){
					var skillsListToggleStatus = {};

					if (skillsListToggleStatus[id]) {
						skillsListToggleStatus[id] = undefined;
					}else{
						skillsListToggleStatus[id] = true;
					}

					window.sessionStorage.setItem("skillsListToggleStatus",JSON.stringify(skillsListToggleStatus));
				}	

				function callExpandList(){
					var $this = $(this); // button that is clicked
					$this.off("click");
					
					// console.log($this[0]);
					saveToSession($elem[0].id);
					expandListFunc.call(expand,$elem,(listHeight + initialHeightOfListOrderDesc),main,parentGroup);

					var tl = new TimelineLite();
					tl.to(listOrderDesc,.6,{
						autoAlpha: 1,
						height: initialHeightOfListOrderDesc
					}).fromTo(arrow,.9,{
						autoAlpha:.5,
						scaleY: 0
					},{
						autoAlpha:1,
						scaleY: 1
					},"-=.3"); 
					
					$this.on("click",callCollapseList);
				}

				function callCollapseList(){
					var $this = $(this);
					$this.off("click");

					saveToSession($elem[0].id);
					collapseListFunc.call(expand,$elem,listContainerDefaultHeight,main,parentGroup);

					var tl = new TimelineLite();
					tl.to(listOrderDesc,.2,{
						autoAlpha: 0,
						height: 0
					}).to(arrow,.4,{
						autoAlpha:0,
						scaleY: 0
					},"-=.2"); 

					$this.on("click",callExpandList);
				}

				expand.on("click",callExpandList);

			});

			function expandListFunc(listContainer,listHeight,main,parentGroup){
				var $this = $(this);
				

				// console.log(listContainer);
				// console.log(listHeight);
				console.log("before expand: " + main.height());
				
				var tm = new TimelineMax({
					onComplete: setHeightsForGroups.bind($this,main,parentGroup)
				});

				tm.to(listContainer,.3,{
					height: (listHeight + 100) + "px",
					ease: Power2.easeOut
				},"listExpanded").to($this,.3,{
					rotation:180
				});

			}			
			function collapseListFunc(listContainer,listHeight,main,parentGroup){
				var $this = $(this);
				// console.log(listContainer);
				// console.log(listHeight);
				console.log("before collapse: "+ main.height());

				var tm = new TimelineMax({
					onComplete: setHeightsForGroups.bind($this,main,parentGroup)
				});

				tm.to(listContainer,.2,{
					height: listHeight + "px",
					ease: Power2.easeOut
				},"listCollapsed").to($this,.2,{
					rotation:0
				});

			}
			function setHeightsForGroups(main,parentGroup){
				/*
				console.log("callback: "+ main.height());
				setTimeout(function(){
					console.log("callback 0ms: "+ main.height());
				},0);
				setTimeout(function(){
					console.log("callback 5ms: "+ main.height());
				},5);
				setTimeout(function(){
					console.log("callback 10ms: "+ main.height());
				},10);
				setTimeout(function(){
					console.log("callback 2: "+ main.height());
				},50);
				setTimeout(function(){
					console.log("callback 3: "+ main.height());
				},100);*/
				var extra = parallaxGroupExtraHeight;
				var newTl = new TimelineLite();
				setTimeout(function(){
					var	mainHeight = main.height() + extra;

					console.log("callback: "+ main.height());
					console.log("callback: "+ mainHeight);

					newTl.to(parentGroup,.3,{
						height: mainHeight
					});

				},setTimeoutDelayForSettingHeights);
			}

	}



				// hash scrolling handlers
	// SIAF
	function hashScroll(){
		scrollingLinks.on("click",function(){
			var $this = $(this),
			scrollToPoint = $this.data("hash_scroll_to");
			// var toPoint = type of ($this.data("hashScrollTo")) ? 
			TweenLite.to(scrollingContainer, 1, {scrollTo:scrollToPoint,ease:Power2.easeOut});
			// alert(scrollToPoint);
			if (scrollToPoint == undefined) { console.log("data-hash_scroll_to is not defined")}
		});
	} /*hashScroll function*/


			// helpbox handler
	// SIAF
	function helpboxHandler(){
		var model = {
			skillsImprovingUpon: "These are the skills which i would say that i am still grasping on while working with them on real projects to be if not perfect, atleast be very comfortable with them "
		,	futureSkills: "These are the technologies which i have an eye on and as soon as my scheduled allows me for it i'll be picking up from one of these to learn & work on. "
		}
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

	var model_objects_proto = function(obj){
		var type = obj.type;
		this.type = type;

	};



			// modal handler
	// SIAF
	function modalHandler(){
		var model = {};

		model.getAQuote = new model_objects_proto({
			type: "html"
		});
		model.getAQuote.content = "getAQuoteTemplate";

		model.viewCaseStudy = new model_objects_proto({type:"html"});
		model.viewCaseStudy.content = '<div class="message message--sorry">sorry case studies are not added yet. I am working on it but it will take time as i am working with my team on some other projects. Check back soon in a couple weeks. :></div>'
		model.getAQuote.content = '<div class="message message--sorry">sorry this part is being developed. For now youcan head over to the contact section to get a quote directly from me.</div>'


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




	// utility functions
	// SIAF
	function getTopOffsetsForHeaderScrollLinks(){
		headerScrollLinks.each(function(i,elem){
			var $this = $(elem),
			scrollsToElementId = $this.data("hash_scroll_to");

			var elementItself = scrollingContainer.find(scrollsToElementId);
			var offsetTopForElement= elementItself.offset().top;
			scrollPositionOfHashLinks.push(offsetTopForElement);
			
		});
		console.log(scrollPositionOfHashLinks);
	}

	

			// scrollBackToLastPosition function to scroll back to the last cached function
	function scrollBackToLastPosition(){
		var scrollToDefault = sessionStorage.getItem("lastScrollPos");
		if (scrollToDefault) {
			TweenLite.to(scrollingContainer, 1, {scrollTo:{y:scrollToDefault},ease:Power2.easeOut});	
		}
	}

			// checkBreakpoints function to run on resize and load
	var smBreakpointInitiated = false,	mdBreakpointInitiated = false,	lgBreakpointInitiated = false;
	function checkBreakpoints(){
		if (windowWidth >= 768) {
			if (!smBreakpointInitiated) {

				smBreakpointInitiated = true;

				/*code for sm breakpoint STARTS here*/
					smBreakpoint();
				/*code for sm breakpoint ENDS here*/

				if (windowWidth >= 992) {

					if (!mdBreakpointInitiated) {

						mdBreakpointInitiated = true;

						/*code for md breakpoint STARTS here*/
							mdBreakpoint();
						/*code for md breakpoint ENDS here*/

						if (windowWidth >= 1200) {

							if (lgBreakpointInitiated) {

								lgBreakpointInitiated = true;

								/*code for lg breakpoint STARTS here*/
									lgBreakpoint();
								/*code for lg breakpoint ENDS here*/


							}/* check if lg breakpoint has ran earlier*/

						}/* check if window is larger than 1200*/

					}/* check if md breakpoint has ran earlier*/

				}/* check if window is larger than 992*/

			}/* check if sm breakpoint has ran earlier*/

		}/* check if window is larger than 768*/
	}/* checkBreakpoints function */

			// toggle function to toggle menus in header and footer
	function toggle(options){
		var pullIcons, pushIcons;

		if (!options.openButton && !options.closeButton) {
			return console.log('no toggle buttons provided');
		}
		options.effects.defaults = {};
		pullIcons = options.openButton;
		pushIcons = options.closeButton;	

		if (options.inverseButtonAppearance) {
			TweenLite.set(pullIcons,{autoAlpha:0});
		}else{
			TweenLite.set(pushIcons,{autoAlpha:0});
		}


		if (!options.events) {
			options.events = 'click'
		}

		pullIcons.on(options.events,function(){
			var $this = $(this);
			var visibleIcon = $this.siblings(".icon--toggle");
			var dataToggle = $this.data("toggle");
			var listContainer = $this.siblings('.list__container');
			var nav = $this.closest("."+ $.trim(dataToggle));
			var list = $this.siblings("[class^='list--']");

			console.log(listContainer);

			options.effects.defaults.open = function(){
				var tl = new TimelineLite();

				tl.set(listContainer,{
					"display":"block"
				}).to($this,.3,{
					autoAlpha: 0
				});

				TweenLite.to(visibleIcon.add(listContainer),.3,{
					autoAlpha: 1
				});
			}
			if (options.effects) {
				if (options.effects.open && typeof options.effects.open == 'function') {
					options.effects.open({
						nav: nav,
						list: list,
						visibleIcon: visibleIcon,
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

		pushIcons.on(options.events,function(){
			var $this = $(this);
			var dataToggle = $this.data("toggle");
			var visibleIcon = $this.siblings(".icon--toggle");
			var listContainer = $this.siblings(".list__container");
			var nav = $this.closest("."+ $.trim(dataToggle));
			var list = $this.siblings("[class^='list--']");

			console.log(listContainer);

			options.effects.defaults.close = function(){
				var tl = new TimelineLite();
				tl.to($this.add(listContainer),.3,{
					autoAlpha:0
				}).set(listContainer,{
					"display":"none"
				});

				TweenLite.to(visibleIcon,.3,{
					autoAlpha: 1
				});
			}

			if (options.effects) {
				if (options.effects.close && typeof options.effects.close == 'function') {
					options.effects.close({
						nav: nav,
						list: list,
						visibleIcon: visibleIcon,
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
	};



	/* INCOMPLETE */
			// reopenSkillsLists function to open the last opened skills lists 
	function reopenSkillsLists(){
		var skillsListToggleStatus = JSON.parse(sessionStorage.getItem("skillsListToggleStatus"));
		// var OpenSkillsListFor = [];

		console.log(skillsListToggleStatus);


		Object.keys(skillsListToggleStatus).forEach(function(id){
			var element = $("#"+id);
			var expand = $elem.find(".expand");
			var main = $elem.closest(".main"),
			parentGroup = main.closest(".parallax__group");
			var technologyList = $elem.find(".technologyList");
			var listHeight = technologyList.height();

			expandListFunc.call(expand,$elem,listHeight,main,parentGroup);
		});

	}


	function doSessionWorkOnLoad(){
		// reopenSkillsLists();
		scrollBackToLastPosition();
	}


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
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
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
		var dataHover = $this.text();

		$this.attr("data-hover",dataHover);
	});


	

			// contact form
	cfAllFields.on("focus",function(e){
		var $this = $(this);

		$this.addClass("focused");

		if (e.target.tagName=="SELECT") {
			var itsSelect = true;
			var option = $this.find('.default');
			var customText = option.data("default-text");
			var contactFormDefaultHelpText;

			if (customText && customText != "") {
				contactFormDefaultHelpText = customText + cfHelpText;	
			}else{
				contactFormDefaultHelpText = dataDefaultText + cfHelpText;	
			}
			option.html(contactFormDefaultHelpText);

		}
	
		$this.on('blur',function(e){
			var value = $.trim($this.val());
			
			if (value == "") {
				$this.removeClass("focused");
			}
			if (itsSelect) {
				option.html(contactFormDefaultText);
			}
		});
		
	});


}());