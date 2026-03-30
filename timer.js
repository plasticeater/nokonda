const GAME_TICK = 1000/7;
const DAY_SECONDS = 86400;
//タルコフはUTC+3なんで3時間追加してます
const OFFSET = 3 * 3600;

function getGameSeconds(){

    const realMs = Date.now();

    const gameSeconds =
        Math.floor(realMs / GAME_TICK);

    return (gameSeconds + OFFSET) % DAY_SECONDS;
}

function format(sec){

    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = sec%60;

    return `${String(h).padStart(2,'0')}:`+
           `${String(m).padStart(2,'0')}:`+
           `${String(s).padStart(2,'0')}`;
}

function secondsUntil21(sec){
//22時までの時間計算用
    const target = 21*3600;

    if(sec <= target) return target-sec;

    return (DAY_SECONDS-sec)+target;
}

function secondsUntil6(sec){

    const target = 6 * 3600;

    if(sec < target) return target - sec;

    return (DAY_SECONDS - sec) + target;
}

function formatRealTime(){

    const now = new Date();

    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');

    return `${h}:${m}:${s}`;
}

function setFutureTime(elementId, seconds){

    const now = new Date();
    const future = new Date(now.getTime() + seconds*1000);

    const h = String(future.getHours()).padStart(2,'0');
    const m = String(future.getMinutes()).padStart(2,'0');
    const s = String(future.getSeconds()).padStart(2,'0');

    document.getElementById(elementId).textContent =
        `現実時間  ${h}:${m}:${s}`;
}

function update(){

    const daySec = getGameSeconds();
    const nightSec = (daySec + 43200) % DAY_SECONDS;

    document.getElementById("dayClock").textContent =
        format(daySec);

    document.getElementById("nightClock").textContent =
        format(nightSec);

    document.getElementById("realClock").textContent =
        formatRealTime();

    const dayWaitGame = secondsUntil21(daySec);
    const nightWaitGame = secondsUntil21(nightSec);

    const waitGame = Math.min(dayWaitGame,nightWaitGame);

    const waitReal = waitGame / 7;

    const min = Math.floor(waitReal/60);
    const sec = Math.floor(waitReal%60);

    document.getElementById("wait").textContent =
        `${min}分 ${sec}秒`;

    setFutureTime("waitReal", waitReal);

    const waitBox = document.querySelector(".highlight");
    const notice = document.getElementById("nightNotice");
    const nightTimer = document.getElementById("nightTimer");
    const nightCard = document.getElementById("nightCard");

    //21:00-06:00判定
    const isNight =
        (daySec >= 21*3600 || daySec < 6*3600) ||
        (nightSec >= 21*3600 || nightSec < 6*3600);

    if(isNight){

        waitBox.classList.add("night");

        nightCard.style.display = "block";
        notice.textContent = "Terminal残り時間";

        const dayWait4Game = secondsUntil6(daySec);
        const nightWait4Game = secondsUntil6(nightSec);

        const wait4Game = Math.min(dayWait4Game, nightWait4Game);
        const wait4Real = wait4Game / 7;

        const min = Math.floor(wait4Real/60);
        const sec = Math.floor(wait4Real%60);

        nightTimer.textContent =
            `${min}分 ${sec}秒`;

        setFutureTime("nightReal", wait4Real);

    }else{

        waitBox.classList.remove("night");

        nightCard.style.display = "none";
        notice.textContent = "";
        nightTimer.textContent = "";
        document.getElementById("nightReal").textContent = "";

    }
}

setInterval(update,200);
update();