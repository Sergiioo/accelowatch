var MainSpring = (function () {

    /**
     * The spring is wound to power the watch
     *
     * @param stoppedCallback called when we've wound down completely
     * @constructor creates a new MainSpring instance
     */
    function MainSpring(stoppedCallback) {
        this._powerReserve = 0;
        this.maxPowerReserve = 10;
        this.intervalId = null;
        this.stoppedCallback = stoppedCallback;
        this.updatePower();
    }

    //  don't allow over-winding - can't wind beyond the max power reserve
    Object.defineProperty(MainSpring.prototype, "powerReserve", {
        get: function () {
            return this._powerReserve;
        },
        set: function (powerReserve) {
            this._powerReserve = powerReserve;
            if (this._powerReserve > this.maxPowerReserve) {
                this._powerReserve = this.maxPowerReserve;
            }
            this.updatePower();
        },
        enumerable: true,
        configurable: false
    });

    //  increment the amount that the spring is wound, and start ticking
    MainSpring.prototype.wind = function (increment) {
        var previous = this.powerReserve;
        this.startWindingDown();
        increment = increment || 1;
        this.powerReserve += increment;
        return previous < this.powerReserve;
    };

    //  the spring winds down a chunk each second
    MainSpring.prototype.startWindingDown = function () {
        //  don't start again
        if (this.intervalId) {
            return;
        }

        //  add the ticking animation
        var hands = document.getElementsByClassName('hand-container');
        Array.prototype.forEach.call(hands, function (handElement) {
            handElement.classList.add('ticking');
        });

        //  windDown periodically until the power has run out
        this.intervalId = window.setInterval(this.windDown.bind(this), 10000);
    };

    //  we're out of power, so stop trying to wind down any further
    MainSpring.prototype.stopWindingDown = function () {
        //  remove the animation
        var hands = document.getElementsByClassName('hand-container');
        Array.prototype.forEach.call(hands, function (handElement) {
            handElement.classList.remove('ticking');
        });

        //  clear the ticking interval
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }

        //  notify that we've stopped
        if (this.stoppedCallback) {
            this.stoppedCallback();
        }
    };

    //  wind down a chunk
    MainSpring.prototype.windDown = function () {
        if (this.powerReserve <= 1) {
            this.powerReserve = 0;
            this.stopWindingDown();
        } else {
            this.powerReserve -= 1;
        }
    };

    //  update the power reserve meter
    MainSpring.prototype.updatePower = function () {
        document.getElementById('power-reserve-indicator').setAttribute('data-power', this.powerReserve);
    };

    return MainSpring;

}());


var Rotor = (function () {

    /**
     * The rotor is the part that reacts to movement to wind the main spring
     *
     * @param mainSpring spring that were winding
     * @constructor creates a new Rotor instance
     */
    function Rotor(mainSpring) {
        this.mainSpring = mainSpring;
        this.startListener();
    }

    //  start listening to large acceleration events
    Rotor.prototype.startListener = function () {
        var _this = this;
        //  the rotor turns when the device motion event is fired, and winds the spring
        window.addEventListener("devicemotion", function (event) {
            return _this.onAcceleration(event);
        }, true);
    };

    //  wind ths spring when we receive a large acceleration
    Rotor.prototype.onAcceleration = function (event) {
        if (event && event.acceleration) {
            if (Math.abs(event.acceleration.x) > 3 || Math.abs(event.acceleration.y) > 3) {
                if (this.mainSpring.wind()) {
                    this.highlight();
                }
            }
        }
    };

    Rotor.prototype.highlight = function () {
        var self = this;
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.timeoutId = document.body.classList.add('winding');
        window.setTimeout(function () {
            document.body.classList.remove('winding');
            self.timeoutId = null;
        }, 200);
    };

    return Rotor;

}());


var Watch = (function () {

    /**
     * Puts together the various parts (spring, rotor) and sets the start date / time
     *
     * @constructor creates a new Watch instance
     */
    function Watch() {
        this.spring = new MainSpring(this.reset.bind(this));
        this.rotor = new Rotor(this.spring);
        this.rotor.startListener();
        this.setDate();
        this.setTime();
        this.spring.wind(10);
    }

    Watch.prototype.reset = function () {
        this.setDate();
        this.setTime();
    };

    Watch.prototype.setTime = function () {
        var now = new Date();
        var secondsStart = ((now.getSeconds() / 60) * 360) + 180;
        var minutesStart = (((now.getMinutes() + (now.getSeconds() / 60)) / 60) * 360) + 180;
        var hoursStart = ((((now.getHours() % 12) + (now.getMinutes() / 60)) / 12) * 360) + 180;
        this.setHands(secondsStart, minutesStart, hoursStart);
    };

    Watch.prototype.setDate = function () {
        var now = new Date();
        var dateInMonth = now.getDate();
        document.getElementById('date-day').innerHTML = '' + dateInMonth;
    };

    //  initial start position of the hands - hand rotation is done with CSS, so we only need to set the start
    Watch.prototype.setHands = function (seconds, minutes, hours) {
        document.getElementById('seconds').style.transform = "rotate(" + seconds + "deg)";
        document.getElementById('minutes').style.transform = "rotate(" + minutes + "deg)";
        document.getElementById('hours').style.transform = "rotate(" + hours + "deg)";
    };

    return Watch;

}());

new Watch();
