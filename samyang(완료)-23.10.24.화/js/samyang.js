$(function () {
    // gnbWrap과 대메뉴 변수지정
    var wrap = $('.gnbWrap');
    var menu = $('.gnbWrap > ul.gnb>li');
    // 현재의 각 페이지 URL 가져옴 
    var pageURL = location.href;
    var activeMenu; // 활성 메뉴 저장변수(선언만함)

    // 메뉴이벤트
    // mouseover - 마우스 올렸을때
    // mouseout - 마우스 벗어났을때
    menu.on({
        mouseover: function () {
            var tg = $(this); // this (=) gnbWrap > ul.gnb > li 
            menu.removeClass('on'); // 모든 메뉴에서 on 클래스 삭제 
            tg.addClass('on'); // 이벤트가 일어난 메뉴에  'on' 클래스 추가
            var th = 68 + tg.children('.sGnbArea').height();
            // gnbWrap 의 높이값 계산 
            // ul.gnb > li 로 되어있는 대메뉴의 자식인 div.sGnbArea 
            // var th = 68; // 기본 높이를 68px로 초기화 해주었음
            // 반환 - 함수를 호출한 곳으로 전달하는 동작 
            wrap.stop().animate({
                height: th
            }); // wrap 에  높이 애니메이션 설정 
        },
        // 마우스가 벗어났을때의 이벤트 
        mouseout: function () {
            var tg = $(this); // 현재 메뉴 
            tg.removeClass('on'); // on 클래스 제거 
            var th = 68; // 초기 Wrap 높이
            wrap.stop().animate({
                height: th
            });
            // wrap의 높이에 애니메이션 설정
        }
    });

    // 메뉴 아이템 순회 
    // .each - 반복문 메서드 - 반복 작업 진행시 사용 
    // index 에 접근하게 해주기 위해 function에 i를 넣어줌 

    menu.each(function (i) {
        var tg = $(this); // 현재 아이템
        var sub = tg.find('> .sGnbArea > ul > li');
        // submenu의 li
        var menuURL = tg.children('a').attr('href');
        // 현재 메뉴의 링크 URL
        // .indexOf() - 요소의 위치를 찾는데 사용하는 메서드 (함수)
        var active = pageURL.indexOf(menuURL);
        if (active > -1) activeMenu = tg;
        sub.each(function (i) {
            var tg = $(this); // 현재 요소 
            // 현재 하위 메뉴
            var subURL = tg.children('a').attr('href');
            // 아이템의 링크 URL
            active = pageURL.indexOf(subURL);
            // 현재 페이지 URL에 하위 메뉴 URL 을 포함하고 있는지 확인
            if (active > -1) activeMenu = tg;
        });

        // 하위 메뉴 아이템에 대한 이벤트 핸들러 설정
        sub.on({
            // 마우스올렸을때
            mouseover: function (event) {
                var tg = $(this); // 현재요소
                sub.removeClass('on'); // 모든 서브메뉴 on제거
                tg.addClass('on'); // 현재서브 on추가
            },
            // 마우스 벗어났을때
            mouseout: function () {
                var tg = $(this); // 현재요소
                tg.removeClass('on'); // 현재하위요소 on제거
            }
        });
    });


    // ========================================= slide 

    // 슬라이드와 버튼 요소 선택
    var visual = $('#main_slides > ul.slides_container > li');
    var button = $('#main_slides > ul.slides-pagenation > li');
    var current = 0; // 현재 활성화된 슬라이드 인덱스
    var setIntervalId; // 자동 슬라이드 간격을 관리할 변수

    // 버튼 클릭 이벤트 처리
    button.on({
        click: function () {
            var tg = $(this);
            var i = tg.index();
            button.removeClass('on'); // 모든 버튼에서 'on' 클래스 제거
            tg.addClass('on'); // 클릭한 버튼에 'on' 클래스 추가
            move(i); // 해당 인덱스의 슬라이드로 이동
        }
    });

    // 이전 슬라이드 버튼 클릭 이벤트 처리
    $('#prev').click(function () {
        var n = current - 1; // 현재 활성화된 슬라이드의 인덱스에서 1을 뺍니다. 이는 이전 슬라이드로 이동하기 위한 인덱스를 계산합니다.

        if (n == -1) {
            n = visual.size() - 1; // 슬라이드의 첫 번째 슬라이드에서 이전을 누르면, 마지막 슬라이드로 이동하도록 합니다. 이 부분은 슬라이드 순환을 처리합니다.
        }

        move(n); // 계산된 인덱스로 슬라이드를 이동시킵니다.
        button.eq(n).trigger('click'); // 이전 슬라이드에 해당하는 버튼을 클릭한 것과 동일한 효과를 주기 위해 해당 버튼을 클릭 이벤트로 처리합니다.
        return false; // 이벤트 처리 후 기본 동작을 방지하기 위해 false를 반환합니다. 예를 들어, 링크의 기본 동작(페이지 이동)을 방지합니다.

    });

    // 다음 슬라이드 버튼 클릭 이벤트 처리
    $('#next').click(function () {
        var n = current + 1;
        // 현재의 current 변수에 1을 더하여 다음 슬라이드를 선택하는 인덱스를 준비합니다.

        if (n == visual.size()) {
            // 만약 n 값이 이미 슬라이드의 총 개수와 동일하다면,
            // 다음 슬라이드가 없다는 의미입니다.
            n = 0; // n 값을 0으로 설정하여 처음 슬라이드로 돌아갑니다.
        }

        move(n); // move() 함수를 호출하여 슬라이드를 변경합니다.

        button.eq(n).trigger('click');
        // n 번째 버튼(페이지네이션 버튼)을 선택하고 이 버튼에 대한 클릭 이벤트를 강제로 실행시킵니다.
        return false;
        // 클릭 이벤트의 기본 동작을 중단시키고, 페이지 이동을 막습니다.

    });

    // 마우스가 슬라이드 영역에 머물렀을때 슬라이드 전환 효과를 정지시키는 이벤트 

    $('#main_slides').on({
        mouseover: function () {
            clearInterval(setIntervalId);
            // clearInterval - 주기적인 작업 중단 
            // setIntervalId - 슬라이드쇼 전환시 사용 (일정시간 간격식별 변수)           
        },
        // 마우스가 벗어났을때 슬라이드 다시 시작
        mouseout: function () {
            timer();
            // timer() - 슬라이드 자동전환 타이머 시작 함수호출
        }
    });

    timer(); // 페이지 로딩 후 초기 슬라이드 자동 시작 


    // 자동 슬라이드 동작 함수 
    function timer() {
        setIntervalId = setInterval(function () {
            var n = current + 1; // 현재 인덱스에 1을 더하여 다음 인덱스를 계산합니다.
            if (n == visual.size()) {
                // 다음 인덱스가 'visual' 컬렉션의 크기와 같은지 확인합니다.
                // 만약 다음 인덱스가 컬렉션의 크기와 같다면, 이것은 끝에 도달했음을 의미합니다.
                // 이 상황을 처리하기 위한 코드를 여기에 추가할 수 있습니다.
                n = 0; // 다음 슬라이드가 없으면, 0으로 돌아감 
            }
            // 다음 슬라이드 버튼을 클릭하여 슬라이드 변경 
            button.eq(n).click();
        }, 3000); // 3초 
    }

    // 슬라이드 이동 함수 
    function move(i) {
        if (current == i) return;
        // 현재 활성된 슬라이드의 목표 슬라이드가 같으면 동작하지 않음
        var currentEl = visual.eq(current); // 현재 슬라이드 
        var nextEl = visual.eq(i); // 목표 슬라이드

        currentEl.css({ // currentEl의 CSS 속성을 설정합니다. 현재 엘리먼트의 left 속성을 '0%'으로 설정하여 현재 위치를 나타냅니다.
            left: '0%'
        }).stop().animate({ // .stop() 메서드를 사용하여 이전에 실행 중인 모든 애니메이션을 중지합니다.
            left: '-100%'
        }); // 슬라이드 왼쪽으로 이동
        // animate() 메서드를 사용하여 엘리먼트를 왼쪽으로 애니메이션화합니다. 
        // left 속성을 '-100%'로 설정하여 엘리먼트를 왼쪽으로 이동시킵니다. 이로써 현재 엘리먼트는 화면에서 사라지게 됩니다.


        nextEl.css({ // 다음 엘리먼트(nextEl)를 오른쪽에서 화면으로 이동시키는 애니메이션을 실행합니다. 
            // nextEl의 CSS 속성을 설정합니다. 다음 엘리먼트의 left 속성을 '100%'로 설정하여 오른쪽에서 시작하도록 합니다.
            left: '100%'
        }).stop().animate({ // .stop() 메서드를 사용하여 이전에 실행 중인 모든 애니메이션을 중지합니다.
            left: '0%' // animate() 메서드를 사용하여 엘리먼트를 애니메이션화합니다.
            // left 속성을 '0%'로 설정하여 엘리먼트가 화면 내에서 가운데로 이동합니다. 이로써 다음 엘리먼트가 화면에 나타나게 됩니다.
        });
        current = i; // 현재 슬라이드 인덱스를 갱신 (=업데이트)
    }

    // 따라다니는 퀵메뉴 - 스크롤바가 이동될때마다 이벤트 발생
    $(window).scroll(function () {
        // 현재 스크롤 위치를 가져오고 15px 더함
        var scrollTopNum = $(document).scrollTop() + 15; // scrollTopNum 변수를 생성하고, 현재 문서의 스크롤 위치($(document).scrollTop())에 15를 더한 값을 할당합니다.
        if (scrollTopNum <= 200) { // 만약 scrollTopNum이 200보다 작거나 같으면, 즉, 사용자가 문서를 위로 스크롤하는 경우,
            scrollTopNum = 200; //  scrollTopNum을 200으로 설정합니다. 
        }
        // scrollTopNum이 200보다 작거나 같으면 200으로 고정
        // #quick을 0.7초동안 scrollTopNum 위치에 부드럽게 이동시킴 
        $("#quick").stop().animate({ // #quick 요소를 선택하고, .animate() 메서드를 사용하여 요소의 위치를 부드럽게 변경합니다.
            top: scrollTopNum // top 속성을 scrollTopNum 값으로 설정하면서, 스크롤 위치(scrollTopNum)에 따라 요소의 위치가 변화합니다.
        }, 700); // 0.7초 
    });


    $("#quick .arrow").on("click", function () {
        $("html,body").stop().animate({
            scrollTop: 0 // 수직 스크롤 위치 
        }, 400);
    });

    var visual = $('#main_slides > li'); // 'main_slides' 요소의 자식인 'li' 요소들을 선택하여 'visual' 변수에 저장합니다.
    var button = $('.btn_wrap > ul > li'); // 'btn_wrap' 클래스 내부에 있는 'ul' 요소의 자식 'li' 요소들을 선택하여 'button' 변수에 저장합니다.
    var autoSlideIntervalId; // 자동 슬라이드 간격을 제어하는 타이머 식별자를 저장하는 'autoSlideIntervalId' 변수를 선언합니다.
    


    button.on('click', function () {
        var idx = $(this).index(); // 클릭한 버튼의 인덱스를 가져옵니다.
        move(idx); // 클릭한 버튼에 해당하는 슬라이드로 이동합니다.
    });

    var autoSlideIntervalId; // 슬라이드 자동 전환을 위한 인터벌 ID를 저장하는 변수를 선언합니다.

    function startAutoSlide() {
        autoSlideIntervalId = setInterval(function () {
            var nextSlideIndex = current + 1;
             // 만약 다음 슬라이드 인덱스가 슬라이드 개수와 동일하다면,
            if (nextSlideIndex === visual.size()) {
                nextSlideIndex = 0; // 다음 슬라이드가 없으면 첫 번째 슬라이드로 돌아갑니다.
            }
            
            button.eq(nextSlideIndex).click(); // 다음 슬라이드로 이동하기 위해 버튼을 클릭합니다.
        }, 3000); // 3초마다 슬라이드를 자동으로 전환합니다.
    }

    startAutoSlide(); // 페이지 로딩 후 초기 슬라이드 자동 시작



    // 신제품 슬라이드

    // 슬라이드에 관련된 JavaScript 코드
    var slides = $("div.product-new > ul > li"); // 슬라이드 이미지 요소들
    var controlButtons = $("div.product-new > .control > li"); // 슬라이드 제어 버튼 요소들
    var autoSlideIntervalId; // 자동 슬라이드를 위한 setInterval의 ID
    var currentSlideIndex = 0; // 현재 보여지고 있는 슬라이드의 인덱스

    function moveToSlide(index) {
        if (currentSlideIndex === index) return;

        var currentSlide = slides.eq(currentSlideIndex);
        var nextSlide = slides.eq(index);

        currentSlide.css({
            left: '0%'
        }).stop().animate({
            left: '-100%'
        });
        nextSlide.css({
            left: '100%'
        }).stop().animate({
            left: '0%'
        });

        currentSlideIndex = index;
    }

    // 슬라이드 제어 버튼 클릭 이벤트 처리
    controlButtons.on({
        click: function () {
            var clickedButton = $(this);
            var buttonIndex = clickedButton.index();
            controlButtons.removeClass('on');
            clickedButton.addClass('on');
            moveToSlide(buttonIndex);
            return false;
        }
    });

    // 슬라이드 영역에 마우스를 올렸을 때 처리
    $('div.product-new').on({
        mouseover: function () {
            clearInterval(autoSlideIntervalId);
        },
        mouseout: function () {
            startAutoSlide();
        }
    });

    // 자동 슬라이드를 실행하는 함수
    function startAutoSlide() {
        autoSlideIntervalId = setInterval(function () {
            var nextSlideIndex = currentSlideIndex + 1;
            if (nextSlideIndex === slides.size()) {
                nextSlideIndex = 0;
            }
            controlButtons.eq(nextSlideIndex).click();
        }, 2000);
    }

    // 초기 자동 슬라이드 시작
    startAutoSlide();

    // 신제품 슬라이드

    // 슬라이드 요소 선택
    var slidesProduct = $("div.newPro3ea > ul > li");
    var indicators = $("div.newPro3ea .inds .indicator");

    // 자동 슬라이드 간격 설정
    var autoSlideIntervalIdProduct;
    var currentSlideIndexProduct = 0;

    // 슬라이드를 지정된 인덱스로 이동하는 함수
    function moveToSlideProduct(index) {
        // 이미 해당 슬라이드에 도달했으면 아무것도 하지 않음
        if (currentSlideIndexProduct === index) return;

        // 슬라이드의 너비를 가져와서 오프셋을 계산
        var slideWidth = slidesProduct.width();
        var offset = -index * slideWidth;

        // 자연스러운 슬라이드 전환을 위해 애니메이션 추가
        $("div.newPro3ea > ul").animate({
            left: offset + "px"
        }, 500, function () {
            // 현재 슬라이드 클래스 제거하고 새로운 슬라이드에 클래스 추가
            slidesProduct.removeClass("on");
            slidesProduct.eq(index).addClass("on");
        });

        currentSlideIndexProduct = index;
        updateIndicatorsProduct(index);
    }


    // 자동 슬라이드 시작 함수
    function startAutoSlideProduct() {
        autoSlideIntervalIdProduct = setInterval(function () {
            // 다음 슬라이드 인덱스 계산
            var nextSlideIndexProduct = currentSlideIndexProduct + 1;

            // 마지막 슬라이드에 도달하면 처음 슬라이드로 다시 시작
            if (nextSlideIndexProduct === slidesProduct.length) {
                nextSlideIndexProduct = 0;
            }

            moveToSlideProduct(nextSlideIndexProduct);
        }, 2000); // 2초 간격으로 슬라이드 변경
    }
    // 수동으로 슬라이드 변경
    function changeSlideProduct(index) {
        // 자동 슬라이드 인터벌 제거
        clearInterval(autoSlideIntervalIdProduct);
        // 원하는 슬라이드로 이동
        moveToSlideProduct(index);
        // 자동 슬라이드 재시작
        startAutoSlideProduct();
    }

    // 슬라이드 인디케이터 업데이트
    function updateIndicatorsProduct(index) {
        indicators.removeClass("active");
        indicators.eq(index).addClass("active");
    }

    // 자동 슬라이드 시작
    startAutoSlideProduct();

    // 인디케이터 클릭 이벤트
    indicators.click(function () {
        var index = $(this).index();
        // 클릭한 인디케이터로 슬라이드 변경
        changeSlideProduct(index);
    });


});