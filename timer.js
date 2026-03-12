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

function secondsUntil22(sec){
//22時までの時間計算用
    const target = 22*3600;

    if(sec <= target) return target-sec;

    return (DAY_SECONDS-sec)+target;
}

function formatRealTime(){

    const now = new Date();

    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');

    return `${h}:${m}:${s}`;
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

    const dayWaitGame = secondsUntil22(daySec);
    const nightWaitGame = secondsUntil22(nightSec);

    const waitGame = Math.min(dayWaitGame,nightWaitGame);

    const waitReal = waitGame / 7;

    const min = Math.floor(waitReal/60);
    const sec = Math.floor(waitReal%60);

    document.getElementById("wait").textContent =
        `${min}分 ${sec}秒`;

    const waitBox = document.querySelector(".highlight");
    const notice = document.getElementById("nightNotice");

    //22:00-04:00判定
    const isNight =
        (daySec >= 22*3600 || daySec < 4*3600) ||
        (nightSec >= 22*3600 || nightSec < 4*3600);

    if(isNight){
        waitBox.classList.add("night");
        notice.textContent = "現在夜です！";
    }else{
        waitBox.classList.remove("night");
        notice.textContent = "";
    }
}

setInterval(update,200);
update();