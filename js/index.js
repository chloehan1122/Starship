// carousel 슬라이더 css 값
function getDeg(count){
    // 180+((360/7)*count)
    return 180+(360/7)*count>360?Math.abs((180+(360/7)*count)-360):180+(360/7)*count
}
/////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){

    ////////////// 스크롤탑 방지
    $('a.no-scroll').on('click', function(event){
        event.preventDefault();
    });
    
    ////////////// 마우스 올렸을 때 다른 스크롤 구현 금지
    $(".btn_gnb").click(function(){
        $("body").toggleClass("disabled");
    })
        // gnb_list>li>a 클릭 toggle
        let state = false;
        $(".gnb_list>li>a").click(function(){
            let gnbDepths = $(this).siblings(".gnb_depths");
            if(state==false){
                $(gnbDepths).addClass("on")
                state = true
            }else{
                $(gnbDepths).removeClass("on")
                state = false
            }
        })

    ////////////// scrollTop
    let scrTop = 0;
    let building_top = $(".building").offset().top;
    let building_height = $(".building").height(); // 애니메이션 속도감을 세팅
    let elv_height = $(".elv").height();
    let anime_length = building_height - elv_height; // 애니메이션 실질적 구간 !== building_height

    $(window).scroll(function(){
        scrTop = $(window).scrollTop()
        // console.log("현재 스크롤바가 위에서"+scrTop+"픽셀만큼 떨어져 있습니다")
        // 헤더 컬러 orange
        if(scrTop>=953){
            $("#logoHeader").attr("src","./img/logo_orange.png")
            $("#btnGnb").attr("src","./img/btn_gnb_o.png")
            $(".gnb .lang").css("color",`#ffa200`).css("border",`1px solid #ffa200`)
        }else{
            $("#logoHeader").attr("src","./img/logo_white.png")
            $("#btnGnb").attr("src","./img/btn_gnb_w.png")
            $(".gnb .lang").css("color",`#fff`).css("border",`1px solid #fff`)
        }

    ///////////////// artist_mo2 마우스 호버 효과
        $('.train_artist>li').click(function() {
            $('.train_artist>li').removeClass('on')
            $(this).addClass('on').siblings().removeClass('on').addClass('sibling');
            // $(this).siblings().removeClass('sibling');
        });

    ////////////////////////////////////////엘레베이터///////////////////////////////////////////////////////////////////
        // 스크롤 애니메이션
        let distance = scrTop - building_top;
        let anime_per = distance / anime_length * 100
        let num = anime_per / (100/7) // 구간마다 0-100% 
        let idx = Math.floor(num) // 0 1 2 3 4
        let iPer = num - idx // 0~1 > 100을 곱하면 0~100 사이의 수가 됨
        let per1 = distance/anime_length //0~>1
        let per2 = 1-per1 //1~>0
        let per3 = 0.5+per1*0.5//0.5~1
        let per4 = per1*130 //0~130
        let per5 = per1*-130 //0~-130
        // console.log(scrTop,distance,anime_length);

        // 엘리베이터 도달하지 못한 상황
        if(distance < 0){
            // $(".cir1").css("transform",`translate(-175%, -50%)`)
            // $(".cir3").css("transform",`translate(75%, -50%)`)
            $(".elv").removeClass("fixed")
            $(".elv").removeClass("bottom")
        }

        // 엘리베이터 도달하여 진행중인 상황
        if(distance>=0  && distance<anime_length){
            $(".elv").addClass("fixed")
            $(".elv").removeClass("bottom")
            // $(".cir1").css("transform",`translate(${-130+per4}%,0)`)
            // $(".cir3").css("transform",`translate(${130+per5}%,0)`)
            if(per1 < 0.14){ // 원의 수평이동
                let transformPhase = per1 / 0.14; // 0 ~ 1
                $(".scr_cir>li").css("color","#000").css("background","#f7f7f7").css("border","1px solid rgb(220, 220, 220)");
                $(".cir2").css("transform", `translate(0)`);
                $(".cir1").css("transform", `translate(${-130 + transformPhase * 130}%, 0)`).css("opacity", 1);
                $(".cir3").css("transform", `translate(${130 - transformPhase * 130}%, 0)`).css("opacity", 1);
            }else if (per1 <= 0.28) { // 원 합치기
                let scalePhase = (per1 - 0.14) / 0.14; // 0 ~ 1
                $(".scr_cir>li").css("scale", 1 - scalePhase * 0.7).css("color","transparent").css("background","#ffa200").css("border","none");
                $(".cir1").css("opacity", 1 - scalePhase).css("background","transparent");
                $(".cir3").css("opacity", 1 - scalePhase).css("background","transparent");
                $(".starship").removeClass("on")
            }else if (per1 <= 0.42) { // 원 위로
                let transYPhase = (per1 -0.28) / 0.14; // 0 ~ 1
                let ypos = -transYPhase * 300;
                let xscale = 1-transYPhase*0.3;
                let yscale = 1+transYPhase*0.3;
                $(".cir2").css("transform", `translateY(${ypos}%) scale(${xscale},${yscale})`);
                $(".starship").addClass("on")
            } else if (per1 <= 0.56) { // 원 아래로
                let transYPhase = (per1 - 0.42) / 0.14; // 0 ~ 1
                let ypos = transYPhase * 300 - 300;
                let xscale = 0.7+transYPhase*0.6;
                let yscale = 1.3-transYPhase*0.6 ;
                $(".cir2").css("transform", `translateY(${ypos}%) scale(${xscale},${yscale})`);
                $(".starship").addClass("on")
                $(".with").removeClass("on")
            } else if (per1 <= 0.70) { // 원위로
                let transYPhase = (per1 - 0.56) / 0.14; // 0 ~ 1
                let ypos = -transYPhase * 300;
                let xscale = 1.3-transYPhase*0.6;
                let yscale = 0.7+transYPhase*0.6;
                $(".cir2").css("transform", `translateY(${ypos}%) scale(${xscale},${yscale})`);
                $(".starship").removeClass("on")
                $(".with").addClass("on")
            } else if (per1 <= 0.84) { // 원아래로
                let transYPhase = (per1 - 0.70) / 0.14; // 0 ~ 1
                let ypos = transYPhase * 300 - 300;
                let xscale = 0.7+transYPhase*0.6;
                let yscale = 1.3-transYPhase*0.6 ;
                $(".cir2").css("transform", `translateY(${ypos}%) scale(${xscale},${yscale})`);
                $(".with").addClass("on")
                $(".entertain").removeClass("on")
            } else if (per1 <= 1) { // 원위로
                let transYPhase = (per1 - 0.84) / 0.14; // 0 ~ 1
                let ypos = -transYPhase * 600;
                let xscale = 1.3-transYPhase*0.6;
                let yscale = 0.7+transYPhase*0.6;
                $(".cir2").css("transform", `translateY(${ypos}%) scale(${xscale},${yscale})`);
                $(".with").removeClass("on")
                $(".entertain").addClass("on")

                $(".cir1").css("opacity", 0);
                $(".cir2").css("opacity", 1);
                $(".cir3").css("opacity", 0);
            }
        }
        // 엘리베이터 벗어난 상황
        if(distance > anime_length){
            $(".elv").removeClass("fixed")
            $(".elv").addClass("bottom")
        }
    })


    ////////////////// header:before 태그
    let gnbState = false;
    $(".btn_gnb").click(function(e){
        e.preventDefault()
        if(gnbState==false){
            $("header").addClass("on")
            $(".gnb_list").addClass("on")
            $("#logoHeader").attr("src","./img/logo_orange.png")
            $("#btnGnb").attr("src","./img/btn_close.png")
            $(".lang").css("color","#ffa200")
            $(".lang").css("border","1px solid #ffa200")
            gnbState=true
        }else{
            scrTop = $(window).scrollTop()
            if(scrTop>=953){
                $("#logoHeader").attr("src","./img/logo_orange.png")
                $("#btnGnb").attr("src","./img/btn_gnb_o.png")
                $(".gnb .lang").css("color",`#ffa200`).css("border",`1px solid #ffa200`)
            }else{
                $("#logoHeader").attr("src","./img/logo_white.png")
                $("#btnGnb").attr("src","./img/btn_gnb_w.png")
                $(".gnb .lang").css("color",`#fff`).css("border",`1px solid #fff`)
            }

            $("header").removeClass("on")
            $(".gnb_list").removeClass("on")
            gnbState=false
        }
    })

    ///////////////// banner 뮤비 슬라이드 button
    let swiper2 = new Swiper(".video_station", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

    swiper2.on("slideChangeTransitionStart", function() {
        SlideChange()
      })

    function SlideChange(){
        $('.video .swiper-slide').each(function(index) {
                    
            const $iframe = $(this).find('iframe');
            // console.log(swiper2.activeIndex)
            const src = $iframe.attr('src');
            if (index === swiper2.activeIndex) {
                $iframe.attr('src', src.replace('autoplay=0', 'autoplay=1'));
            } else {  
                $iframe.attr('src', src.replace('autoplay=1', 'autoplay=0'));
            }
        });
      }
      
    // let count = 0;
    // $(".station_btn .btn_rt").click(function(e){
    //     e.preventDefault()
    //     count++
    //     if(count>2){count=0}
    //         $(".video_station .video").css("transform",`translateX(${count*-33.333}%)`)
    //         $(".video_station .video>li").removeClass("active")
    //         $(".video_station .video>li").eq(count).addClass("active")
    // })
    // $(".station_btn .btn_lt").click(function(e){
    //     e.preventDefault()
    //     count--
    //     if(count<0){count=0}
    //         $(".video_station .video").css("transform",`translateX(${count*-33.333}%)`)
    //         $(".video_station .video>li").removeClass("active")
    //         $(".video_station .video>li").eq(count).addClass("active")
    // })


    ////////////////////////////////////////아티스트 휠 pc버전///////////////////////////////////////////////////////////////////
    // carousel 슬라이드 영역
    let carousel_count = 0;
    let per_deg = 360 / 7;
    // carousel 돌아감 origin(0,0)
    function rotateCarousel(count){
        $(".carousel").css("transform",`rotate(${-count * per_deg}deg)`);
        $(".carousel>div").each(function(index){
            $(this).css("transform",`rotate(${getDeg(index)}deg) translateX(35rem) rotate(${-getDeg(index)}deg) rotate(${count * per_deg}deg)`);
        });
        $(".carousel>div").removeClass("on");
        $(".carousel>div").eq(count % 7).addClass("on");
    }
            // 팬카페  
            function fanCafe(cid){
                const slideLinks = {
                    0: "https://cafe.daum.net/IVEstarship",
                    1: "https://cafe.daum.net/WJSNcosmic",
                    2: "https://cafe.daum.net/monsta-x",
                    3: "https://cafe.daum.net/cravity-official",
                    4: "https://cafe.daum.net/Hyungknight",
                    5: "https://cafe.daum.net/official-jeongsewoon",
                    6: ""
                };
                const link = slideLinks[cid];
                $(".artist").find('.fan_cafe').attr("href", link);
            }
            // 아티스트명 탭
            function artistTab(cid){
                $(".tap_artist li").removeClass("on");
                $(".tap_artist li").eq(cid).addClass("on");
            }
            // 아티스트명 SLIDE IN
            function artistName(cid){
                $(".artist_name>li").removeClass("on");
                $(".artist_name>li").eq(cid).addClass("on");
            }

    // 탭 클릭시 슬라이드가 돌아감
    $(".tap_artist>li").click(function(e){
        e.preventDefault()
        let clickedIndex = $(this).index();
        rotateCarousel(clickedIndex)
        artistTab(clickedIndex)
        artistName(clickedIndex)
        fanCafe(clickedIndex)
        // return false
    });
    // 슬라이드 클릭시 적용
    $(".carousel>div").click(function(){
        let clickedIndex = $(this).index();
        // 팬카페  
        fanCafe(clickedIndex)
        // 아티스트명 탭
        artistTab(clickedIndex) 
        // 아티스트명 SLIDE IN
        artistName(clickedIndex)
        rotateCarousel(clickedIndex)
    });
    // 버튼 클릭시 적용
    $(".carousel_btn .btn_rt").click(function(){
        carousel_count++;
        if(carousel_count>6){carousel_count=0}
        rotateCarousel(carousel_count)
        fanCafe(carousel_count)
        artistTab(carousel_count)
        artistName(carousel_count)
    });

    $(".carousel_btn .btn_lt").click(function(){
        carousel_count--;
        if(carousel_count<0){carousel_count=6}
        rotateCarousel(carousel_count)
        fanCafe(carousel_count)
        artistTab(carousel_count)
        artistName(carousel_count)
    });

    /////////////////아티스트 tab1 버전 
    let swiper1 = new Swiper("#station_artist1", {
        slidesPerView: 2,
        // spaceBetween: 30,
        centeredSlides: true,
        loop: true,
    });
        // ---> 탭 클릭하면 이동
        $(".tap_ar_mo>li").click(function(e){
            e.preventDefault()
            let clickedIndex = $(this).index();   
            swiper1.slideToLoop(clickedIndex, 1000)
            $(".tap_ar_mo>li>a").removeClass("on")
            $(this).children("a").addClass("on")
        })
    /////////////////아티스트 tab 버전 
    let swiper = new Swiper("#station_artist", {
        slidesPerView: 1,
        // spaceBetween: 30,
        centeredSlides: true,
        loop: true,
    });
        // ---> 탭 클릭하면 이동
        $(".tap_ar_mo>li").click(function(e){
            e.preventDefault()
            let clickedIndex = $(this).index();   
            swiper.slideToLoop(clickedIndex, 1000)
            $(".tap_ar_mo>li>a").removeClass("on")
            $(this).children("a").addClass("on")
        })

    /////////////////아티스트 모바일 버전 
    $(document).ready(function() {
        $(".tap_ar_mo>li").click(function(e) {
            e.preventDefault();
            let clickedIndex = $(this).index();
            // console.log(clickedIndex);

            $(".tap_ar_mo>li").removeClass("on");
            $(this).addClass("on");

            $(".train_artist>li").removeClass("on").hide();
            $(".train_artist>li").eq(clickedIndex).addClass("on").show();
        });

        // 초기 상태에서 첫 번째 아이템만 보이도록 설정
        $(".train_artist>li").hide();
        $(".train_artist>li.on").show();
    });


   ////////////////뉴스 호버시 clear border-radius
   $(".newsOn").mouseover(function(){
        $(this).addClass("clear")
   })
   $(".newsOn").mouseleave(function(){
        $(this).removeClass("clear")
    })


    /////////////뉴스 more
    let newsMore_count = 3;
    let newsMore_add = 3; 
    let windowWidth = $( window ).width();
    if(windowWidth<1025 && windowWidth>768){
        newsMore_count = 2;
        newsMore_add = 2; //테블릿
    }else if(windowWidth<768){
        newsMore_add = 1; //모바일
    }
    function inputNewsList(arrayNews,views){
        // console.log(views)
        let result = "";
        for(let i=0 ; i<views ; i++){
            // console.log(i, arrayNews.length)

            result+=`<li>
            <div class="news_h">
                <a class="newsOn" href="#"><img src="./img/${arrayNews[i].nThumb}" alt="${arrayNews[i].nTitle}"></a>
                <a href="#" class="no-scroll newsBtn">자세히 보기</a>
            </div>
            <div class="news_info">
                <h2>${arrayNews[i].nTitle}</h2>
                <p>
                ${arrayNews[i].nDesc}
                </p>
                <span>${arrayNews[i].nDate}</span>
            </div>
        </li>`            
            if(i==arrayNews.length-1){
                $(".moreBtn").hide();
                break;
            }
        }
        $(".news_list").html(result)

    }
    inputNewsList(newslistArray,newsMore_count) // 모바일에서 초기환경 뉴스 3개 보이게 설정
    
    $(".moreBtn").click(function(e){
        e.preventDefault()
        newsMore_count+=newsMore_add
            inputNewsList(newslistArray,newsMore_count) // 카운트 개수만큼 ul li 의 내용을 새롭게 채워넣음

            // newsmore_height = $(".news_more").height()
            // $(".news_more").css("height",newsmore_height+listHeight)  // 자동 height 라서 불필요
    })
});





















    // 휠 애니메이션 적용
    // $('.banner').on('wheel', function(event){
    //     var originalEvent = event.originalEvent;
    //     var delta = originalEvent.deltaY || -originalEvent.wheelDelta;

    //     if (delta > 0) {
    //         // 휠내렸을때
    //         // console.log('Scrolling down in ' + this.id);
    //         $("html,body").stop().animate({"scrollTop":$(".artist").offset().top},600)
    //     } else {
    //         // 휠올렸을때
    //         // console.log('Scrolling up in ' + this.id);
    //     }
    //     // Prevent default scrolling behavior
    //     event.preventDefault();
    // });

    // $('.artist').on('wheel', function(event){
    //     var originalEvent = event.originalEvent;
    //     var delta = originalEvent.deltaY || -originalEvent.wheelDelta;

    //     if (delta > 0) {
    //         // 휠내렸을때
    //         // console.log('Scrolling down in ' + this.id);
    //         $("html,body").stop().animate({"scrollTop":$(".cl").offset().top},600)
    //     } else {
    //         // 휠올렸을때
    //         $("html,body").stop().animate({"scrollTop":$(".banner").offset().top},600)
    //         // console.log('Scrolling up in ' + this.id);
    //     }
    //     // Prevent default scrolling behavior
    //     event.preventDefault();
    // });

    // $('.album').on('wheel', function(event){
    //     var originalEvent = event.originalEvent;
    //     var delta = originalEvent.deltaY || -originalEvent.wheelDelta;

    //     if (delta > 0) {
    //         event.preventDefault();
    //         // 휠내렸을때
    //         // console.log('Scrolling down in ' + this.id);
    //         $("html,body").stop().animate({"scrollTop":$(".news").offset().top},600)
    //     } else {
    //         // 휠올렸을때
    //         // $("html,body").stop().animate({"scrollTop":$(".artist").offset().top},600)
    //         // console.log('Scrolling up in ' + this.id);
    //     }
    //     // Prevent default scrolling behavior
        
    // });

    // $('.news').on('wheel', function(event){
    //     var originalEvent = event.originalEvent;
    //     var delta = originalEvent.deltaY || -originalEvent.wheelDelta;

    //     if (delta > 0) {
    //         // 휠내렸을때
    //         // console.log('Scrolling down in ' + this.id);
    //         // $("html,body").stop().animate({"scrollTop":$(".album").offset().top},600)
    //     } else {
    //         // 휠올렸을때
    //         $("html,body").stop().animate({"scrollTop":$(".album").offset().top},600)
    //         // console.log('Scrolling up in ' + this.id);
    //     }
    //     // Prevent default scrolling behavior
    //     event.preventDefault();
    // });
    
    

    // 새로고침 시 탑으로 이동
    // $("html,body").stop().animate({"scrollTop":0},500)













    

























