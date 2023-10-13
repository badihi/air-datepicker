;(function (window, $, undefined) { var JalaliDate;
;(function () {
    JalaliDate = function (i, h, f) {
        var d;
        var a;
        if (!isNaN(parseInt(i)) && !isNaN(parseInt(h)) && !isNaN(parseInt(f))) {
            var c = j([parseInt(i, 10), parseInt(h, 10), parseInt(f, 10)]);
            e(new Date(c[0], c[1], c[2]))    } else {
            e(i)
        }

        function j(l) {
            var k = 0;
            if (l[1] < 0) {
                k = leap_persian(l[0] - 1) ? 30 : 29;
                l[1]++
            }
            var g = jd_to_gregorian(persian_to_jd(l[0], l[1] + 1, l[2]) - k);
            g[1]--;
            return g
        }

        function b(k) {
            var g = jd_to_persian(gregorian_to_jd(k[0], k[1] + 1, k[2]));
            g[1]--;
            return g
        }

        function e(g) {
            if (g && g.getGregorianDate) {
                g = g.getGregorianDate()
            }
            d = new Date(g);
            // d.setHours(d.getHours() > 12 ? d.getHours() + 2 : 2);
            if (!d || d == "Invalid Date" || isNaN(d || !d.getDate())) {
                d = new Date()
            }
            a = b([d.getFullYear(), d.getMonth(), d.getDate()]);
            return this
        }
        this.getNativeDate = function() {
            // d.setHours(d.getHours() > 12 ? d.getHours() + 2 : 2);
            return d
        };
        this.setFullDate = e;
        this.setGregorianDate = function(year, month, day){
            d = new Date(year, month, day);
            a = b([year, month, day]);
        };
        this.setYear = function(l) {
            a[0] = l;
            var k = j(a);
            d = new Date(k[0], k[1], k[2]);
            a = b([k[0], k[1], k[2]])
        };
        this.setMonth = function(l) {
            a[1] = l;
            var k = j(a);
            d = new Date(k[0], k[1], k[2]);
            a = b([k[0], k[1], k[2]])
        };
        this.setDate = function(l) {
            a[2] = l;
            var k = j(a);
            d = new Date(k[0], k[1], k[2]);
            a = b([k[0], k[1], k[2]])
        };
        this.getFullYear = function() {
            return a[0]
        };
        this.getMonth = function() {
            return a[1]
        };
        this.getDate = function() {
            return a[2]
        };
        this.toString = function() {
            return a.join(",").toString()
        };
        this.getDay = function() {
            // d.setHours(d.getHours() > 12 ? d.getHours() + 2 : 2);
            return d.getDay()
        };
        this.getUTCDay = function() {
            return d.getUTCDay()
        };
        this.getHours = function() {
            return d.getHours()
        };
        this.getMinutes = function() {
            return d.getMinutes()
        };
        this.getSeconds = function() {
            return d.getSeconds()
        };
        this.getTime = function() {
            return d.getTime()
        };
        this.getTimezoneOffset = function() {
            return d.getTimezoneOffset()
        };
        this.getYear = function() {
            return a[0] % 100
        };
        this.setTime = function(g) {
            d.setTime(g)
        };
        this.setHours = function(g) {
            d.setHours(g)
        };
        this.setMinutes = function(g) {
            d.setMinutes(g)
        };
        this.setSeconds = function(g) {
            d.setSeconds(g)
        };
        this.setMilliseconds = function(g) {
            d.setMilliseconds(g)
        };
        this.getMilliseconds = function() {
            return d.getMilliseconds();
        };
        this.getCurrentMonthDayCount = function() {
            var month = this.getMonth();
            if (month < 6) {
                return 31;
            } else if (month < 11) {
                return 30;
            } else if (leap_persian(this.getFullYear())){
                return 30;
            } else {
                return 29;
            }
        }
    };

    JalaliDate.calendarName = 'jalali';


    /*
                JavaScript functions for positional astronomy

                    by John Walker  --  September, MIM
                        http://www.fourmilab.ch/

                    This program is in the public domain.
    */

    //  Frequently-used constants

    var
        J2000 = 2451545.0, // Julian day of J2000 epoch
        JulianCentury = 36525.0, // Days in Julian century
        JulianMillennium = (JulianCentury * 10), // Days in Julian millennium
        AstronomicalUnit = 149597870.0, // Astronomical unit in kilometres
        TropicalYear = 365.24219878; // Mean solar tropical year

    /*  ASTOR  --  Arc-seconds to radians.  */

    function astor(a) {
        return a * (Math.PI / (180.0 * 3600.0));
    }

    /*  DTR  --  Degrees to radians.  */

    function dtr(d) {
        return (d * Math.PI) / 180.0;
    }

    /*  RTD  --  Radians to degrees.  */

    function rtd(r) {
        return (r * 180.0) / Math.PI;
    }

    /*  FIXANGLE  --  Range reduce angle in degrees.  */

    function fixangle(a) {
        return a - 360.0 * (Math.floor(a / 360.0));
    }

    /*  FIXANGR  --  Range reduce angle in radians.  */

    function fixangr(a) {
        return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
    }

    //  DSIN  --  Sine of an angle in degrees

    function dsin(d) {
        return Math.sin(dtr(d));
    }

    //  DCOS  --  Cosine of an angle in degrees

    function dcos(d) {
        return Math.cos(dtr(d));
    }

    /*  MOD  --  Modulus function which works for non-integers.  */

    function mod(a, b) {
        return a - (b * Math.floor(a / b));
    }

    //  AMOD  --  Modulus function which returns numerator if modulus is zero

    function amod(a, b) {
        return mod(a - 1, b) + 1;
    }

    /*  JHMS  --  Convert Julian time to hour, minutes, and seconds,
                returned as a three-element array.  */

    function jhms(j) {
        var ij;

        j += 0.5; /* Astronomical to civil */
        ij = ((j - Math.floor(j)) * 86400.0) + 0.5;
        return new Array(
            Math.floor(ij / 3600),
            Math.floor((ij / 60) % 60),
            Math.floor(ij % 60));
    }

    //  JWDAY  --  Calculate day of week from Julian day

    var Weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday");

    function jwday(j) {
        return mod(Math.floor((j + 1.5)), 7);
    }

    /*  OBLIQEQ  --  Calculate the obliquity of the ecliptic for a given
                    Julian date.  This uses Laskar's tenth-degree
                    polynomial fit (J. Laskar, Astronomy and
                    Astrophysics, Vol. 157, page 68 [1986]) which is
                    accurate to within 0.01 arc second between AD 1000
                    and AD 3000, and within a few seconds of arc for
                    +/-10000 years around AD 2000.  If we're outside the
                    range in which this fit is valid (deep time) we
                    simply return the J2000 value of the obliquity, which
                    happens to be almost precisely the mean.  */

    var oterms = new Array(-4680.93, -1.55,
        1999.25, -51.38, -249.67, -39.05,
        7.12,
        27.87,
        5.79,
        2.45
    );

    function obliqeq(jd) {
        var eps, u, v, i;

        v = u = (jd - J2000) / (JulianCentury * 100);

        eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

        if (Math.abs(u) < 1.0) {
            for (i = 0; i < 10; i++) {
                eps += (oterms[i] / 3600.0) * v;
                v *= u;
            }
        }
        return eps;
    }

    /* Periodic terms for nutation in longiude (delta \Psi) and
    obliquity (delta \Epsilon) as given in table 21.A of
    Meeus, "Astronomical Algorithms", first edition. */

    var nutArgMult = new Array(
        0, 0, 0, 0, 1, -2, 0, 0, 2, 2,
        0, 0, 0, 2, 2,
        0, 0, 0, 0, 2,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0, -2, 1, 0, 2, 2,
        0, 0, 0, 2, 1,
        0, 0, 1, 2, 2, -2, -1, 0, 2, 2, -2, 0, 1, 0, 0, -2, 0, 0, 2, 1,
        0, 0, -1, 2, 2,
        2, 0, 0, 0, 0,
        0, 0, 1, 0, 1,
        2, 0, -1, 2, 2,
        0, 0, -1, 0, 1,
        0, 0, 1, 2, 1, -2, 0, 2, 0, 0,
        0, 0, -2, 2, 1,
        2, 0, 0, 2, 2,
        0, 0, 2, 2, 2,
        0, 0, 2, 0, 0, -2, 0, 1, 2, 2,
        0, 0, 0, 2, 0, -2, 0, 0, 2, 0,
        0, 0, -1, 2, 1,
        0, 2, 0, 0, 0,
        2, 0, -1, 0, 1, -2, 2, 0, 2, 2,
        0, 1, 0, 0, 1, -2, 0, 1, 0, 1,
        0, -1, 0, 0, 1,
        0, 0, 2, -2, 0,
        2, 0, -1, 2, 1,
        2, 0, 1, 2, 2,
        0, 1, 0, 2, 2, -2, 1, 1, 0, 0,
        0, -1, 0, 2, 2,
        2, 0, 0, 2, 1,
        2, 0, 1, 0, 0, -2, 0, 2, 2, 2, -2, 0, 1, 2, 1,
        2, 0, -2, 0, 1,
        2, 0, 0, 0, 1,
        0, -1, 1, 0, 0, -2, -1, 0, 2, 1, -2, 0, 0, 0, 1,
        0, 0, 2, 2, 1, -2, 0, 2, 0, 1, -2, 1, 0, 2, 1,
        0, 0, 1, -2, 0, -1, 0, 1, 0, 0, -2, 1, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 1, 2, 0, -1, -1, 1, 0, 0,
        0, 1, 1, 0, 0,
        0, -1, 1, 2, 2,
        2, -1, -1, 2, 2,
        0, 0, -2, 2, 2,
        0, 0, 3, 2, 2,
        2, -1, 0, 2, 2
    );

    var nutArgCoeff = new Array(-171996, -1742, 92095, 89, /*  0,  0,  0,  0,  1 */ -13187, -16, 5736, -31, /* -2,  0,  0,  2,  2 */ -2274, -2, 977, -5, /*  0,  0,  0,  2,  2 */
        2062, 2, -895, 5, /*  0,  0,  0,  0,  2 */
        1426, -34, 54, -1, /*  0,  1,  0,  0,  0 */
        712, 1, -7, 0, /*  0,  0,  1,  0,  0 */ -517, 12, 224, -6, /* -2,  1,  0,  2,  2 */ -386, -4, 200, 0, /*  0,  0,  0,  2,  1 */ -301, 0, 129, -1, /*  0,  0,  1,  2,  2 */
        217, -5, -95, 3, /* -2, -1,  0,  2,  2 */ -158, 0, 0, 0, /* -2,  0,  1,  0,  0 */
        129, 1, -70, 0, /* -2,  0,  0,  2,  1 */
        123, 0, -53, 0, /*  0,  0, -1,  2,  2 */
        63, 0, 0, 0, /*  2,  0,  0,  0,  0 */
        63, 1, -33, 0, /*  0,  0,  1,  0,  1 */ -59, 0, 26, 0, /*  2,  0, -1,  2,  2 */ -58, -1, 32, 0, /*  0,  0, -1,  0,  1 */ -51, 0, 27, 0, /*  0,  0,  1,  2,  1 */
        48, 0, 0, 0, /* -2,  0,  2,  0,  0 */
        46, 0, -24, 0, /*  0,  0, -2,  2,  1 */ -38, 0, 16, 0, /*  2,  0,  0,  2,  2 */ -31, 0, 13, 0, /*  0,  0,  2,  2,  2 */
        29, 0, 0, 0, /*  0,  0,  2,  0,  0 */
        29, 0, -12, 0, /* -2,  0,  1,  2,  2 */
        26, 0, 0, 0, /*  0,  0,  0,  2,  0 */ -22, 0, 0, 0, /* -2,  0,  0,  2,  0 */
        21, 0, -10, 0, /*  0,  0, -1,  2,  1 */
        17, -1, 0, 0, /*  0,  2,  0,  0,  0 */
        16, 0, -8, 0, /*  2,  0, -1,  0,  1 */ -16, 1, 7, 0, /* -2,  2,  0,  2,  2 */ -15, 0, 9, 0, /*  0,  1,  0,  0,  1 */ -13, 0, 7, 0, /* -2,  0,  1,  0,  1 */ -12, 0, 6, 0, /*  0, -1,  0,  0,  1 */
        11, 0, 0, 0, /*  0,  0,  2, -2,  0 */ -10, 0, 5, 0, /*  2,  0, -1,  2,  1 */ -8, 0, 3, 0, /*  2,  0,  1,  2,  2 */
        7, 0, -3, 0, /*  0,  1,  0,  2,  2 */ -7, 0, 0, 0, /* -2,  1,  1,  0,  0 */ -7, 0, 3, 0, /*  0, -1,  0,  2,  2 */ -7, 0, 3, 0, /*  2,  0,  0,  2,  1 */
        6, 0, 0, 0, /*  2,  0,  1,  0,  0 */
        6, 0, -3, 0, /* -2,  0,  2,  2,  2 */
        6, 0, -3, 0, /* -2,  0,  1,  2,  1 */ -6, 0, 3, 0, /*  2,  0, -2,  0,  1 */ -6, 0, 3, 0, /*  2,  0,  0,  0,  1 */
        5, 0, 0, 0, /*  0, -1,  1,  0,  0 */ -5, 0, 3, 0, /* -2, -1,  0,  2,  1 */ -5, 0, 3, 0, /* -2,  0,  0,  0,  1 */ -5, 0, 3, 0, /*  0,  0,  2,  2,  1 */
        4, 0, 0, 0, /* -2,  0,  2,  0,  1 */
        4, 0, 0, 0, /* -2,  1,  0,  2,  1 */
        4, 0, 0, 0, /*  0,  0,  1, -2,  0 */ -4, 0, 0, 0, /* -1,  0,  1,  0,  0 */ -4, 0, 0, 0, /* -2,  1,  0,  0,  0 */ -4, 0, 0, 0, /*  1,  0,  0,  0,  0 */
        3, 0, 0, 0, /*  0,  0,  1,  2,  0 */ -3, 0, 0, 0, /* -1, -1,  1,  0,  0 */ -3, 0, 0, 0, /*  0,  1,  1,  0,  0 */ -3, 0, 0, 0, /*  0, -1,  1,  2,  2 */ -3, 0, 0, 0, /*  2, -1, -1,  2,  2 */ -3, 0, 0, 0, /*  0,  0, -2,  2,  2 */ -3, 0, 0, 0, /*  0,  0,  3,  2,  2 */ -3, 0, 0, 0 /*  2, -1,  0,  2,  2 */
    );

    /*  NUTATION  --  Calculate the nutation in longitude, deltaPsi, and
                    obliquity, deltaEpsilon for a given Julian date
                    jd.  Results are returned as a two element Array
                    giving (deltaPsi, deltaEpsilon) in degrees.  */

    function nutation(jd) {
        var deltaPsi, deltaEpsilon,
            i, j,
            t = (jd - 2451545.0) / 36525.0,
            t2, t3, to10,
            ta = new Array,
            dp = 0,
            de = 0,
            ang;

        t3 = t * (t2 = t * t);

        /* Calculate angles.  The correspondence between the elements
        of our array and the terms cited in Meeus are:

        ta[0] = D  ta[0] = M  ta[2] = M'  ta[3] = F  ta[4] = \Omega

        */

        ta[0] = dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 +
            t3 / 189474.0);
        ta[1] = dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 -
            t3 / 300000.0);
        ta[2] = dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 +
            t3 / 56250.0);
        ta[3] = dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 +
            t3 / 327270);
        ta[4] = dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 +
            t3 / 450000.0);

        /* Range reduce the angles in case the sine and cosine functions
        don't do it as accurately or quickly. */

        for (i = 0; i < 5; i++) {
            ta[i] = fixangr(ta[i]);
        }

        to10 = t / 10.0;
        for (i = 0; i < 63; i++) {
            ang = 0;
            for (j = 0; j < 5; j++) {
                if (nutArgMult[(i * 5) + j] != 0) {
                    ang += nutArgMult[(i * 5) + j] * ta[j];
                }
            }
            dp += (nutArgCoeff[(i * 4) + 0] + nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
            de += (nutArgCoeff[(i * 4) + 2] + nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
        }

        /* Return the result, converting from ten thousandths of arc
        seconds to radians in the process. */

        deltaPsi = dp / (3600.0 * 10000.0);
        deltaEpsilon = de / (3600.0 * 10000.0);

        return new Array(deltaPsi, deltaEpsilon);
    }

    /*  ECLIPTOEQ  --  Convert celestial (ecliptical) longitude and
                    latitude into right ascension (in degrees) and
                    declination.  We must supply the time of the
                    conversion in order to compensate correctly for the
                    varying obliquity of the ecliptic over time.
                    The right ascension and declination are returned
                    as a two-element Array in that order.  */

    function ecliptoeq(jd, Lambda, Beta) {
        var eps, Ra, Dec;

        /* Obliquity of the ecliptic. */

        eps = dtr(obliqeq(jd));
        log += "Obliquity: " + rtd(eps) + "\n";

        Ra = rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                (Math.tan(dtr(Beta)) * Math.sin(eps))),
            Math.cos(dtr(Lambda))));
        log += "RA = " + Ra + "\n";
        Ra = fixangle(rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                (Math.tan(dtr(Beta)) * Math.sin(eps))),
            Math.cos(dtr(Lambda)))));
        Dec = rtd(Math.asin((Math.sin(eps) * Math.sin(dtr(Lambda)) * Math.cos(dtr(Beta))) +
            (Math.sin(dtr(Beta)) * Math.cos(eps))));

        return new Array(Ra, Dec);
    }


    /*  DELTAT  --  Determine the difference, in seconds, between
                    Dynamical time and Universal time.  */

    /*  Table of observed Delta T values at the beginning of
        even numbered years from 1620 through 2002.  */

    var deltaTtab = new Array(
        121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
        44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
        11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
        10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
        13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
        16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
        11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
        5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
        1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6, -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
        18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
        24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
        33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
        52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6
    );

    function deltat(year) {
        var dt, f, i, t;

        if ((year >= 1620) && (year <= 2000)) {
            i = Math.floor((year - 1620) / 2);
            f = ((year - 1620) / 2) - i; /* Fractional part of year */
            dt = deltaTtab[i] + ((deltaTtab[i + 1] - deltaTtab[i]) * f);
        } else {
            t = (year - 2000) / 100;
            if (year < 948) {
                dt = 2177 + (497 * t) + (44.1 * t * t);
            } else {
                dt = 102 + (102 * t) + (25.3 * t * t);
                if ((year > 2000) && (year < 2100)) {
                    dt += 0.37 * (year - 2100);
                }
            }
        }
        return dt;
    }

    /*  EQUINOX  --  Determine the Julian Ephemeris Day of an
                    equinox or solstice.  The "which" argument
                    selects the item to be computed:

                        0   March equinox
                        1   June solstice
                        2   September equinox
                        3   December solstice

    */

    //  Periodic terms to obtain true time

    var EquinoxpTerms = new Array(
        485, 324.96, 1934.136,
        203, 337.23, 32964.467,
        199, 342.08, 20.186,
        182, 27.85, 445267.112,
        156, 73.14, 45036.886,
        136, 171.52, 22518.443,
        77, 222.54, 65928.934,
        74, 296.72, 3034.906,
        70, 243.58, 9037.513,
        58, 119.81, 33718.147,
        52, 297.17, 150.678,
        50, 21.02, 2281.226,
        45, 247.54, 29929.562,
        44, 325.15, 31555.956,
        29, 60.93, 4443.417,
        18, 155.12, 67555.328,
        17, 288.79, 4562.452,
        16, 198.04, 62894.029,
        14, 199.76, 31436.921,
        12, 95.39, 14577.848,
        12, 287.11, 31931.756,
        12, 320.81, 34777.259,
        9, 227.73, 1222.114,
        8, 15.45, 16859.074
    );

    JDE0tab1000 = new Array(
        new Array(1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071),
        new Array(1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025),
        new Array(1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074),
        new Array(1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006)
    );

    JDE0tab2000 = new Array(
        new Array(2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057),
        new Array(2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030),
        new Array(2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078),
        new Array(2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032)
    );

    function equinox(year, which) {
        var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

        /*  Initialise terms for mean equinox and solstices.  We
            have two sets: one for years prior to 1000 and a second
            for subsequent years.  */

        if (year < 1000) {
            JDE0tab = JDE0tab1000;
            Y = year / 1000;
        } else {
            JDE0tab = JDE0tab2000;
            Y = (year - 2000) / 1000;
        }

        JDE0 = JDE0tab[which][0] +
            (JDE0tab[which][1] * Y) +
            (JDE0tab[which][2] * Y * Y) +
            (JDE0tab[which][3] * Y * Y * Y) +
            (JDE0tab[which][4] * Y * Y * Y * Y);

        //document.debug.log.value += "JDE0 = " + JDE0 + "\n";

        T = (JDE0 - 2451545.0) / 36525;
        //document.debug.log.value += "T = " + T + "\n";
        W = (35999.373 * T) - 2.47;
        //document.debug.log.value += "W = " + W + "\n";
        deltaL = 1 + (0.0334 * dcos(W)) + (0.0007 * dcos(2 * W));
        //document.debug.log.value += "deltaL = " + deltaL + "\n";

        //  Sum the periodic terms for time T

        S = 0;
        for (i = j = 0; i < 24; i++) {
            S += EquinoxpTerms[j] * dcos(EquinoxpTerms[j + 1] + (EquinoxpTerms[j + 2] * T));
            j += 3;
        }

        //document.debug.log.value += "S = " + S + "\n";
        //document.debug.log.value += "Corr = " + ((S * 0.00001) / deltaL) + "\n";

        JDE = JDE0 + ((S * 0.00001) / deltaL);

        return JDE;
    }

    /*  SUNPOS  --  Position of the Sun.  Please see the comments
                    on the return statement at the end of this function
                    which describe the array it returns.  We return
                    intermediate values because they are useful in a
                    variety of other contexts.  */

    function sunpos(jd) {
        var T, T2, L0, M, e, C, sunLong, sunAnomaly, sunR,
            Omega, Lambda, epsilon, epsilon0, Alpha, Delta,
            AlphaApp, DeltaApp;

        T = (jd - J2000) / JulianCentury;
        //document.debug.log.value += "Sunpos.  T = " + T + "\n";
        T2 = T * T;
        L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
        //document.debug.log.value += "L0 = " + L0 + "\n";
        L0 = fixangle(L0);
        //document.debug.log.value += "L0 = " + L0 + "\n";
        M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
        //document.debug.log.value += "M = " + M + "\n";
        M = fixangle(M);
        //document.debug.log.value += "M = " + M + "\n";
        e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
        //document.debug.log.value += "e = " + e + "\n";
        C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * dsin(M)) +
            ((0.019993 - (0.000101 * T)) * dsin(2 * M)) +
            (0.000289 * dsin(3 * M));
        //document.debug.log.value += "C = " + C + "\n";
        sunLong = L0 + C;
        //document.debug.log.value += "sunLong = " + sunLong + "\n";
        sunAnomaly = M + C;
        //document.debug.log.value += "sunAnomaly = " + sunAnomaly + "\n";
        sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * dcos(sunAnomaly)));
        //document.debug.log.value += "sunR = " + sunR + "\n";
        Omega = 125.04 - (1934.136 * T);
        //document.debug.log.value += "Omega = " + Omega + "\n";
        Lambda = sunLong + (-0.00569) + (-0.00478 * dsin(Omega));
        //document.debug.log.value += "Lambda = " + Lambda + "\n";
        epsilon0 = obliqeq(jd);
        //document.debug.log.value += "epsilon0 = " + epsilon0 + "\n";
        epsilon = epsilon0 + (0.00256 * dcos(Omega));
        //document.debug.log.value += "epsilon = " + epsilon + "\n";
        Alpha = rtd(Math.atan2(dcos(epsilon0) * dsin(sunLong), dcos(sunLong)));
        //document.debug.log.value += "Alpha = " + Alpha + "\n";
        Alpha = fixangle(Alpha);
        ////document.debug.log.value += "Alpha = " + Alpha + "\n";
        Delta = rtd(Math.asin(dsin(epsilon0) * dsin(sunLong)));
        ////document.debug.log.value += "Delta = " + Delta + "\n";
        AlphaApp = rtd(Math.atan2(dcos(epsilon) * dsin(Lambda), dcos(Lambda)));
        //document.debug.log.value += "AlphaApp = " + AlphaApp + "\n";
        AlphaApp = fixangle(AlphaApp);
        //document.debug.log.value += "AlphaApp = " + AlphaApp + "\n";
        DeltaApp = rtd(Math.asin(dsin(epsilon) * dsin(Lambda)));
        //document.debug.log.value += "DeltaApp = " + DeltaApp + "\n";

        return new Array( //  Angular quantities are expressed in decimal degrees
            L0, //  [0] Geometric mean longitude of the Sun
            M, //  [1] Mean anomaly of the Sun
            e, //  [2] Eccentricity of the Earth's orbit
            C, //  [3] Sun's equation of the Centre
            sunLong, //  [4] Sun's true longitude
            sunAnomaly, //  [5] Sun's true anomaly
            sunR, //  [6] Sun's radius vector in AU
            Lambda, //  [7] Sun's apparent longitude at true equinox of the date
            Alpha, //  [8] Sun's true right ascension
            Delta, //  [9] Sun's true declination
            AlphaApp, // [10] Sun's apparent right ascension
            DeltaApp // [11] Sun's apparent declination
        );
    }

    /*  EQUATIONOFTIME  --  Compute equation of time for a given moment.
                            Returns the equation of time as a fraction of
                            a day.  */

    function equationOfTime(jd) {
        var alpha, deltaPsi, E, epsilon, L0, tau

        tau = (jd - J2000) / JulianMillennium;
        //document.debug.log.value += "equationOfTime.  tau = " + tau + "\n";
        L0 = 280.4664567 + (360007.6982779 * tau) +
            (0.03032028 * tau * tau) +
            ((tau * tau * tau) / 49931) +
            (-((tau * tau * tau * tau) / 15300)) +
            (-((tau * tau * tau * tau * tau) / 2000000));
        //document.debug.log.value += "L0 = " + L0 + "\n";
        L0 = fixangle(L0);
        //document.debug.log.value += "L0 = " + L0 + "\n";
        alpha = sunpos(jd)[10];
        //document.debug.log.value += "alpha = " + alpha + "\n";
        deltaPsi = nutation(jd)[0];
        //document.debug.log.value += "deltaPsi = " + deltaPsi + "\n";
        epsilon = obliqeq(jd) + nutation(jd)[1];
        //document.debug.log.value += "epsilon = " + epsilon + "\n";
        E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * dcos(epsilon));
        //document.debug.log.value += "E = " + E + "\n";
        E = E - 20.0 * (Math.floor(E / 20.0));
        //document.debug.log.value += "Efixed = " + E + "\n";
        E = E / (24 * 60);
        //document.debug.log.value += "Eday = " + E + "\n";

        return E;
    }

    /*
        JavaScript functions for the Fourmilab Calendar Converter

                    by John Walker  --  September, MIM
                http://www.fourmilab.ch/documents/calendar/

                    This program is in the public domain.
    */

    /*  You may notice that a variety of array variables logically local
        to functions are declared globally here.  In JavaScript, construction
        of an array variable from source code occurs as the code is
        interpreted.  Making these variables pseudo-globals permits us
        to avoid overhead constructing and disposing of them in each
        call on the function in which whey are used.  */

    var J0000 = 1721424.5; // Julian date of Gregorian epoch: 0000-01-01
    var J1970 = 2440587.5; // Julian date at Unix epoch: 1970-01-01
    var JMJD = 2400000.5; // Epoch of Modified Julian Date system
    var J1900 = 2415020.5; // Epoch (day 1) of Excel 1900 date system (PC)
    var J1904 = 2416480.5; // Epoch (day 0) of Excel 1904 date system (Mac)

    var NormLeap = new Array("Normal year", "Leap year");

    /*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday)
                            in the seven days ending on jd.  */

    function weekday_before(weekday, jd) {
        return jd - jwday(jd - weekday);
    }

    /*  SEARCH_WEEKDAY  --  Determine the Julian date for: 

                weekday      Day of week desired, 0 = Sunday
                jd           Julian date to begin search
                direction    1 = next weekday, -1 = last weekday
                offset       Offset from jd to begin search
    */

    function search_weekday(weekday, jd, direction, offset) {
        return weekday_before(weekday, jd + (direction * offset));
    }

    //  Utility weekday functions, just wrappers for search_weekday

    function nearest_weekday(weekday, jd) {
        return search_weekday(weekday, jd, 1, 3);
    }

    function next_weekday(weekday, jd) {
        return search_weekday(weekday, jd, 1, 7);
    }

    function next_or_current_weekday(weekday, jd) {
        return search_weekday(weekday, jd, 1, 6);
    }

    function previous_weekday(weekday, jd) {
        return search_weekday(weekday, jd, -1, 1);
    }

    function previous_or_current_weekday(weekday, jd) {
        return search_weekday(weekday, jd, 1, 0);
    }

    function TestSomething() {}

    //  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

    function leap_gregorian(year) {
        return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
    }

    //  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

    var GREGORIAN_EPOCH = 1721425.5;

    function gregorian_to_jd(year, month, day) {
        return (GREGORIAN_EPOCH - 1) +
            (365 * (year - 1)) +
            Math.floor((year - 1) / 4) +
            (-Math.floor((year - 1) / 100)) +
            Math.floor((year - 1) / 400) +
            Math.floor((((367 * month) - 362) / 12) +
                ((month <= 2) ? 0 :
                    (leap_gregorian(year) ? -1 : -2)
                ) +
                day);
    }

    //  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

    function jd_to_gregorian(jd) {
        var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
            yindex, dyindex, year, yearday, leapadj;

        wjd = Math.floor(jd - 0.5) + 0.5;
        depoch = wjd - GREGORIAN_EPOCH;
        quadricent = Math.floor(depoch / 146097);
        dqc = mod(depoch, 146097);
        cent = Math.floor(dqc / 36524);
        dcent = mod(dqc, 36524);
        quad = Math.floor(dcent / 1461);
        dquad = mod(dcent, 1461);
        yindex = Math.floor(dquad / 365);
        year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
        if (!((cent == 4) || (yindex == 4))) {
            year++;
        }
        yearday = wjd - gregorian_to_jd(year, 1, 1);
        leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 :
            (leap_gregorian(year) ? 1 : 2)
        );
        month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
        day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

        return new Array(year, month, day);
    }

    //  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day

    function n_weeks(weekday, jd, nthweek) {
        var j = 7 * nthweek;

        if (nthweek > 0) {
            j += previous_weekday(weekday, jd);
        } else {
            j += next_weekday(weekday, jd);
        }
        return j;
    }

    function iso_to_julian(year, week, day) {
        return day + n_weeks(0, gregorian_to_jd(year - 1, 12, 28), week);
    }

    //  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day

    function jd_to_iso(jd) {
        var year, week, day;

        year = jd_to_gregorian(jd - 3)[0];
        if (jd >= iso_to_julian(year + 1, 1, 1)) {
            year++;
        }
        week = Math.floor((jd - iso_to_julian(year, 1, 1)) / 7) + 1;
        day = jwday(jd);
        if (day == 0) {
            day = 7;
        }
        return new Array(year, week, day);
    }

    //  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year

    function iso_day_to_julian(year, day) {
        return (day - 1) + gregorian_to_jd(year, 1, 1);
    }

    //  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day

    function jd_to_iso_day(jd) {
        var year, day;

        year = jd_to_gregorian(jd)[0];
        day = Math.floor(jd - gregorian_to_jd(year, 1, 1)) + 1;
        return new Array(year, day);
    }

    /*  PAD  --  Pad a string to a given length with a given fill character.  */

    function pad(str, howlong, padwith) {
        var s = str.toString();

        while (s.length < howlong) {
            s = padwith + s;
        }
        return s;
    }

    //  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date

    var JULIAN_EPOCH = 1721423.5;

    function leap_julian(year) {
        return mod(year, 4) == ((year > 0) ? 0 : 3);
    }

    function julian_to_jd(year, month, day) {

        /* Adjust negative common era years to the zero-based notation we use.  */

        if (year < 1) {
            year++;
        }

        /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

        if (month <= 2) {
            year--;
            month += 12;
        }

        return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
    }

    //  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day

    function jd_to_julian(td) {
        var z, a, alpha, b, c, d, e, year, month, day;

        td += 0.5;
        z = Math.floor(td);

        a = z;
        b = a + 1524;
        c = Math.floor((b - 122.1) / 365.25);
        d = Math.floor(365.25 * c);
        e = Math.floor((b - d) / 30.6001);

        month = Math.floor((e < 14) ? (e - 1) : (e - 13));
        year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
        day = b - d - Math.floor(30.6001 * e);

        /*  If year is less than 1, subtract one to convert from
            a zero based date system to the common era system in
            which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

        if (year < 1) {
            year--;
        }

        return new Array(year, month, day);
    }

    //  HEBREW_TO_JD  --  Determine Julian day from Hebrew date

    var HEBREW_EPOCH = 347995.5;

    //  Is a given Hebrew year a leap year ?

    function hebrew_leap(year) {
        return mod(((year * 7) + 1), 19) < 7;
    }

    //  How many months are there in a Hebrew year (12 = normal, 13 = leap)

    function hebrew_year_months(year) {
        return hebrew_leap(year) ? 13 : 12;
    }

    //  Test for delay of start of new year and to avoid
    //  Sunday, Wednesday, and Friday as start of the new year.

    function hebrew_delay_1(year) {
        var months, days, parts;

        months = Math.floor(((235 * year) - 234) / 19);
        parts = 12084 + (13753 * months);
        day = (months * 29) + Math.floor(parts / 25920);

        if (mod((3 * (day + 1)), 7) < 3) {
            day++;
        }
        return day;
    }

    //  Check for delay in start of new year due to length of adjacent years

    function hebrew_delay_2(year) {
        var last, present, next;

        last = hebrew_delay_1(year - 1);
        present = hebrew_delay_1(year);
        next = hebrew_delay_1(year + 1);

        return ((next - present) == 356) ? 2 :
            (((present - last) == 382) ? 1 : 0);
    }

    //  How many days are in a Hebrew year ?

    function hebrew_year_days(year) {
        return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
    }

    //  How many days are in a given month of a given year

    function hebrew_month_days(year, month) {
        //  First of all, dispose of fixed-length 29 day months

        if (month == 2 || month == 4 || month == 6 ||
            month == 10 || month == 13) {
            return 29;
        }

        //  If it's not a leap year, Adar has 29 days

        if (month == 12 && !hebrew_leap(year)) {
            return 29;
        }

        //  If it's Heshvan, days depend on length of year

        if (month == 8 && !(mod(hebrew_year_days(year), 10) == 5)) {
            return 29;
        }

        //  Similarly, Kislev varies with the length of year

        if (month == 9 && (mod(hebrew_year_days(year), 10) == 3)) {
            return 29;
        }

        //  Nope, it's a 30 day month

        return 30;
    }

    //  Finally, wrap it all up into...

    function hebrew_to_jd(year, month, day) {
        var jd, mon, months;

        months = hebrew_year_months(year);
        jd = HEBREW_EPOCH + hebrew_delay_1(year) +
            hebrew_delay_2(year) + day + 1;

        if (month < 7) {
            for (mon = 7; mon <= months; mon++) {
                jd += hebrew_month_days(year, mon);
            }
            for (mon = 1; mon < month; mon++) {
                jd += hebrew_month_days(year, mon);
            }
        } else {
            for (mon = 7; mon < month; mon++) {
                jd += hebrew_month_days(year, mon);
            }
        }

        return jd;
    }

    /*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                        This works by making multiple calls to
                        the inverse function, and is this very
                        slow.  */

    function jd_to_hebrew(jd) {
        var year, month, day, i, count, first;

        jd = Math.floor(jd) + 0.5;
        count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
        year = count - 1;
        for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
            year++;
        }
        first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
        month = first;
        for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
            month++;
        }
        day = (jd - hebrew_to_jd(year, month, 1)) + 1;
        return new Array(year, month, day);
    }

    /*  EQUINOXE_A_PARIS  --  Determine Julian day and fraction of the
                            September equinox at the Paris meridian in
                            a given Gregorian year.  */

    function equinoxe_a_paris(year) {
        var equJED, equJD, equAPP, equParis, dtParis;

        //  September equinox in dynamical time
        equJED = equinox(year, 2);

        //  Correct for delta T to obtain Universal time
        equJD = equJED - (deltat(year) / (24 * 60 * 60));

        //  Apply the equation of time to yield the apparent time at Greenwich
        equAPP = equJD + equationOfTime(equJED);

        /*  Finally, we must correct for the constant difference between
            the Greenwich meridian and that of Paris, 2°20'15" to the
            East.  */

        dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
        equParis = equAPP + dtParis;

        return equParis;
    }

    /*  PARIS_EQUINOXE_JD  --  Calculate Julian day during which the
                            September equinox, reckoned from the Paris
                            meridian, occurred for a given Gregorian
                            year.  */

    function paris_equinoxe_jd(year) {
        var ep, epg;

        ep = equinoxe_a_paris(year);
        epg = Math.floor(ep - 0.5) + 0.5;

        return epg;
    }

    /*  ANNEE_DE_LA_REVOLUTION  --  Determine the year in the French
                                    revolutionary calendar in which a
                                    given Julian day falls.  Returns an
                                    array of two elements:

                                        [0]  Année de la Révolution
                                        [1]  Julian day number containing
                                            equinox for this year.
    */

    var FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;

    function annee_da_la_revolution(jd) {
        var guess = jd_to_gregorian(jd)[0] - 2,
            lasteq, nexteq, adr;

        lasteq = paris_equinoxe_jd(guess);
        while (lasteq > jd) {
            guess--;
            lasteq = paris_equinoxe_jd(guess);
        }
        nexteq = lasteq - 1;
        while (!((lasteq <= jd) && (jd < nexteq))) {
            lasteq = nexteq;
            guess++;
            nexteq = paris_equinoxe_jd(guess);
        }
        adr = Math.round((lasteq - FRENCH_REVOLUTIONARY_EPOCH) / TropicalYear) + 1;

        return new Array(adr, lasteq);
    }

    /*  JD_TO_FRENCH_REVOLUTIONARY  --  Calculate date in the French Revolutionary
                                        calendar from Julian day.  The five or six
                                        "sansculottides" are considered a thirteenth
                                        month in the results of this function.  */

    function jd_to_french_revolutionary(jd) {
        var an, mois, decade, jour,
            adr, equinoxe;

        jd = Math.floor(jd) + 0.5;
        adr = annee_da_la_revolution(jd);
        an = adr[0];
        equinoxe = adr[1];
        mois = Math.floor((jd - equinoxe) / 30) + 1;
        jour = (jd - equinoxe) % 30;
        decade = Math.floor(jour / 10) + 1;
        jour = (jour % 10) + 1;

        return new Array(an, mois, decade, jour);
    }

    /*  FRENCH_REVOLUTIONARY_TO_JD  --  Obtain Julian day from a given French
                                        Revolutionary calendar date.  */

    function french_revolutionary_to_jd(an, mois, decade, jour) {
        var adr, equinoxe, guess, jd;

        guess = FRENCH_REVOLUTIONARY_EPOCH + (TropicalYear * ((an - 1) - 1));
        adr = new Array(an - 1, 0);

        while (adr[0] < an) {
            adr = annee_da_la_revolution(guess);
            guess = adr[1] + (TropicalYear + 2);
        }
        equinoxe = adr[1];

        jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
        return jd;
    }

    //  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?

    function leap_islamic(year) {
        return (((year * 11) + 14) % 30) < 11;
    }

    //  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date

    var ISLAMIC_EPOCH = 1948439.5;
    var ISLAMIC_WEEKDAYS = new Array("al-'ahad", "al-'ithnayn",
        "ath-thalatha'", "al-'arb`a'",
        "al-khamis", "al-jum`a", "as-sabt");

    function islamic_to_jd(year, month, day) {
        return (day +
            Math.ceil(29.5 * (month - 1)) +
            (year - 1) * 354 +
            Math.floor((3 + (11 * year)) / 30) +
            ISLAMIC_EPOCH) - 1;
    }

    //  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day

    function jd_to_islamic(jd) {
        var year, month, day;

        jd = Math.floor(jd) + 0.5;
        year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
        month = Math.min(12,
            Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
        day = (jd - islamic_to_jd(year, month, 1)) + 1;
        return new Array(year, month, day);
    }

    //  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

    function leap_persian(year) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    }

    //  PERSIAN_TO_JD  --  Determine Julian day from Persian date

    var PERSIAN_EPOCH = 1948320.5;
    var PERSIAN_WEEKDAYS = new Array("Yekshanbeh", "Doshanbeh",
        "Seshhanbeh", "Chaharshanbeh",
        "Panjshanbeh", "Jomeh", "Shanbeh");

    function persian_to_jd(year, month, day) {
        var epbase, epyear;

        epbase = year - ((year >= 0) ? 474 : 473);
        epyear = 474 + mod(epbase, 2820);

        return day +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
            Math.floor(((epyear * 682) - 110) / 2816) +
            (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 +
            (PERSIAN_EPOCH - 1);
    }

    //  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

    function jd_to_persian(jd) {
        var year, month, day, depoch, cycle, cyear, ycycle,
            aux1, aux2, yday;


        jd = Math.floor(jd) + 0.5;

        depoch = jd - persian_to_jd(475, 1, 1);
        cycle = Math.floor(depoch / 1029983);
        cyear = mod(depoch, 1029983);
        if (cyear == 1029982) {
            ycycle = 2820;
        } else {
            aux1 = Math.floor(cyear / 366);
            aux2 = mod(cyear, 366);
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                aux1 + 1;
        }
        year = ycycle + (2820 * cycle) + 474;
        if (year <= 0) {
            year--;
        }
        yday = (jd - persian_to_jd(year, 1, 1)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        day = (jd - persian_to_jd(year, month, 1)) + 1;
        return new Array(year, month, day);
    }

    //  MAYAN_COUNT_TO_JD  --  Determine Julian day from Mayan long count

    var MAYAN_COUNT_EPOCH = 584282.5;

    function mayan_count_to_jd(baktun, katun, tun, uinal, kin) {
        return MAYAN_COUNT_EPOCH +
            (baktun * 144000) +
            (katun * 7200) +
            (tun * 360) +
            (uinal * 20) +
            kin;
    }

    //  JD_TO_MAYAN_COUNT  --  Calculate Mayan long count from Julian day

    function jd_to_mayan_count(jd) {
        var d, baktun, katun, tun, uinal, kin;

        jd = Math.floor(jd) + 0.5;
        d = jd - MAYAN_COUNT_EPOCH;
        baktun = Math.floor(d / 144000);
        d = mod(d, 144000);
        katun = Math.floor(d / 7200);
        d = mod(d, 7200);
        tun = Math.floor(d / 360);
        d = mod(d, 360);
        uinal = Math.floor(d / 20);
        kin = mod(d, 20);

        return new Array(baktun, katun, tun, uinal, kin);
    }

    //  JD_TO_MAYAN_HAAB  --  Determine Mayan Haab "month" and day from Julian day

    var MAYAN_HAAB_MONTHS = new Array("Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul",
        "Yaxkin", "Mol", "Chen", "Yax", "Zac", "Ceh",
        "Mac", "Kankin", "Muan", "Pax", "Kayab", "Cumku", "Uayeb");

    function jd_to_mayan_haab(jd) {
        var lcount, day;

        jd = Math.floor(jd) + 0.5;
        lcount = jd - MAYAN_COUNT_EPOCH;
        day = mod(lcount + 8 + ((18 - 1) * 20), 365);

        return new Array(Math.floor(day / 20) + 1, mod(day, 20));
    }

    //  JD_TO_MAYAN_TZOLKIN  --  Determine Mayan Tzolkin "month" and day from Julian day

    var MAYAN_TZOLKIN_MONTHS = new Array("Imix", "Ik", "Akbal", "Kan", "Chicchan",
        "Cimi", "Manik", "Lamat", "Muluc", "Oc",
        "Chuen", "Eb", "Ben", "Ix", "Men",
        "Cib", "Caban", "Etznab", "Cauac", "Ahau");

    function jd_to_mayan_tzolkin(jd) {
        var lcount;

        jd = Math.floor(jd) + 0.5;
        lcount = jd - MAYAN_COUNT_EPOCH;
        return new Array(amod(lcount + 20, 20), amod(lcount + 4, 13));
    }

    //  BAHAI_TO_JD  --  Determine Julian day from Bahai date

    var BAHAI_EPOCH = 2394646.5;
    var BAHAI_WEEKDAYS = new Array("Jamلl", "Kamلl", "Fidلl", "Idلl",
        "Istijlلl", "Istiqlلl", "Jalلl");

    function bahai_to_jd(major, cycle, year, month, day) {
        var gy;

        gy = (361 * (major - 1)) + (19 * (cycle - 1)) + (year - 1) +
            jd_to_gregorian(BAHAI_EPOCH)[0];
        return gregorian_to_jd(gy, 3, 20) + (19 * (month - 1)) +
            ((month != 20) ? 0 : (leap_gregorian(gy + 1) ? -14 : -15)) +
            day;
    }

    //  JD_TO_BAHAI  --  Calculate Bahai date from Julian day

    function jd_to_bahai(jd) {
        var major, cycle, year, month, day,
            gy, bstarty, bys, days, bld;

        jd = Math.floor(jd) + 0.5;
        gy = jd_to_gregorian(jd)[0];
        bstarty = jd_to_gregorian(BAHAI_EPOCH)[0];
        bys = gy - (bstarty + (((gregorian_to_jd(gy, 1, 1) <= jd) && (jd <= gregorian_to_jd(gy, 3, 20))) ? 1 : 0));
        major = Math.floor(bys / 361) + 1;
        cycle = Math.floor(mod(bys, 361) / 19) + 1;
        year = mod(bys, 19) + 1;
        days = jd - bahai_to_jd(major, cycle, year, 1, 1);
        bld = bahai_to_jd(major, cycle, year, 20, 1);
        month = (jd >= bld) ? 20 : (Math.floor(days / 19) + 1);
        day = (jd + 1) - bahai_to_jd(major, cycle, year, month, 1);

        return new Array(major, cycle, year, month, day);
    }

    //  INDIAN_CIVIL_TO_JD  --  Obtain Julian day for Indian Civil date

    var INDIAN_CIVIL_WEEKDAYS = new Array(
        "ravivara", "somavara", "mangalavara", "budhavara",
        "brahaspativara", "sukravara", "sanivara");

    function indian_civil_to_jd(year, month, day) {
        var Caitra, gyear, leap, start, jd, m;

        gyear = year + 78;
        leap = leap_gregorian(gyear); // Is this a leap year ?
        start = gregorian_to_jd(gyear, 3, leap ? 21 : 22);
        Caitra = leap ? 31 : 30;

        if (month == 1) {
            jd = start + (day - 1);
        } else {
            jd = start + Caitra;
            m = month - 2;
            m = Math.min(m, 5);
            jd += m * 31;
            if (month >= 8) {
                m = month - 7;
                jd += m * 30;
            }
            jd += day - 1;
        }

        return jd;
    }

    //  JD_TO_INDIAN_CIVIL  --  Calculate Indian Civil date from Julian day

    function jd_to_indian_civil(jd) {
        var Caitra, Saka, greg, greg0, leap, start, year, yday, mday;

        Saka = 79 - 1; // Offset in years from Saka era to Gregorian epoch
        start = 80; // Day offset between Saka and Gregorian

        jd = Math.floor(jd) + 0.5;
        greg = jd_to_gregorian(jd); // Gregorian date for Julian day
        leap = leap_gregorian(greg[0]); // Is this a leap year?
        year = greg[0] - Saka; // Tentative year in Saka era
        greg0 = gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
        yday = jd - greg0; // Day number (0 based) in Gregorian year
        Caitra = leap ? 31 : 30; // Days in Caitra this year

        if (yday < start) {
            //  Day is at the end of the preceding Saka year
            year--;
            yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
        }

        yday -= start;
        if (yday < Caitra) {
            month = 1;
            day = yday + 1;
        } else {
            mday = yday - Caitra;
            if (mday < (31 * 5)) {
                month = Math.floor(mday / 31) + 2;
                day = (mday % 31) + 1;
            } else {
                mday -= 31 * 5;
                month = Math.floor(mday / 30) + 7;
                day = (mday % 30) + 1;
            }
        }

        return new Array(year, month, day);
    }

})();

;(function () {
    var VERSION = '2.2.3',
        pluginName = 'datepicker',
        autoInitSelector = '.datepicker-here',
        $body, $datepickersContainer,
        containerBuilt = false,
        baseTemplate = '' +
            '<div class="datepicker">' +
            '<i class="datepicker--pointer"></i>' +
            '<nav class="datepicker--nav"></nav>' +
            '<div class="datepicker--content"></div>' +
            '</div>',
        defaults = {
            classes: '',
            inline: false,
            language: 'ru',
            startDate: new Date(),
            firstDay: '',
            weekends: [6, 0],
            dateFormat: '',
            altField: '',
            altFieldDateFormat: '@',
            toggleSelected: true,
            keyboardNav: true,

            position: 'bottom left',
            offset: 12,

            view: 'days',
            minView: 'days',

            showOtherMonths: true,
            selectOtherMonths: true,
            moveToOtherMonthsOnSelect: true,

            showOtherYears: true,
            selectOtherYears: true,
            moveToOtherYearsOnSelect: true,

            minDate: '',
            maxDate: '',
            disableNavWhenOutOfRange: true,

            multipleDates: false, // Boolean or Number
            multipleDatesSeparator: ',',
            range: false,

            todayButton: false,
            clearButton: false,

            showEvent: 'focus',
            autoClose: false,

            // navigation
            monthsField: 'monthsShort',
            prevHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
            nextHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
            navTitles: {
                days: 'MM, <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },

            // timepicker
            timepicker: false,
            onlyTimepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHours: 0,
            maxHours: 24,
            minMinutes: 0,
            maxMinutes: 59,
            minSeconds: 0,
            maxSeconds: 59,
            hoursStep: 1,
            minutesStep: 1,
            secondsStep: 1,

            // events
            onSelect: '',
            onShow: '',
            onHide: '',
            onChangeMonth: '',
            onChangeYear: '',
            onChangeDecade: '',
            onChangeView: '',
            onRenderCell: ''
        },
        hotKeys = {
            'ctrlRight': [17, 39],
            'ctrlUp': [17, 38],
            'ctrlLeft': [17, 37],
            'ctrlDown': [17, 40],
            'shiftRight': [16, 39],
            'shiftUp': [16, 38],
            'shiftLeft': [16, 37],
            'shiftDown': [16, 40],
            'altUp': [18, 38],
            'altRight': [18, 39],
            'altLeft': [18, 37],
            'altDown': [18, 40],
            'ctrlShiftUp': [16, 17, 38]
        },
        datepicker;

    var Datepicker  = function (el, options) {
        this.el = el;
        this.$el = $(el);

        this.opts = $.extend(true, {}, defaults, options, this.$el.data());

        if ($body == undefined) {
            $body = $('body');
        }

        if (!this.opts.startDate) {
            this.opts.startDate = new Date();
        }

        if (this.el.nodeName == 'INPUT') {
            this.elIsInput = true;
        }

        if (this.opts.altField) {
            this.$altField = typeof this.opts.altField == 'string' ? $(this.opts.altField) : this.opts.altField;
        }

        this.inited = false;
        this.visible = false;
        this.silent = false; // Need to prevent unnecessary rendering

        this.currentDate = this.opts.startDate;
        this.currentView = this.opts.view;
        this._createShortCuts();
        this.selectedDates = [];
        this.views = {};
        this.keys = [];
        this.minRange = '';
        this.maxRange = '';
        this._prevOnSelectValue = '';

        this.init()
    };

    datepicker = Datepicker;

    datepicker.prototype = {
        VERSION: VERSION,
        viewIndexes: ['days', 'months', 'years'],

        init: function () {
            if (!containerBuilt && !this.opts.inline && this.elIsInput) {
                this._buildDatepickersContainer();
            }
            this._buildBaseHtml();
            this._defineLocale(this.opts.language);
            this._syncWithMinMaxDates();

            if (this.elIsInput) {
                if (!this.opts.inline) {
                    // Set extra classes for proper transitions
                    this._setPositionClasses(this.opts.position);
                    this._bindEvents()
                }
                if (this.opts.keyboardNav && !this.opts.onlyTimepicker) {
                    this._bindKeyboardEvents();
                }
                this.$datepicker.on('mousedown', this._onMouseDownDatepicker.bind(this));
                this.$datepicker.on('mouseup', this._onMouseUpDatepicker.bind(this));
            }

            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }

            if (this.opts.timepicker) {
                this.timepicker = new $.fn.datepicker.Timepicker(this, this.opts);
                this._bindTimepickerEvents();
            }

            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }

            this.views[this.currentView] = new $.fn.datepicker.Body(this, this.currentView, this.opts);
            this.views[this.currentView].show();
            this.nav = new $.fn.datepicker.Navigation(this, this.opts);
            this.view = this.currentView;

            this.$el.on('clickCell.adp', this._onClickCell.bind(this));
            this.$datepicker.on('mouseenter', '.datepicker--cell', this._onMouseEnterCell.bind(this));
            this.$datepicker.on('mouseleave', '.datepicker--cell', this._onMouseLeaveCell.bind(this));

            this.inited = true;
        },

        _createShortCuts: function () {
            this.minDate = this.opts.minDate ? this.opts.minDate : new Date(-8639999913600000);
            this.maxDate = this.opts.maxDate ? this.opts.maxDate : new Date(8639999913600000);
        },

        _bindEvents : function () {
            this.$el.on(this.opts.showEvent + '.adp', this._onShowEvent.bind(this));
            this.$el.on('mouseup.adp', this._onMouseUpEl.bind(this));
            this.$el.on('blur.adp', this._onBlur.bind(this));
            this.$el.on('keyup.adp', this._onKeyUpGeneral.bind(this));
            $(window).on('resize.adp', this._onResize.bind(this));
            $('body').on('mouseup.adp', this._onMouseUpBody.bind(this));
        },

        _bindKeyboardEvents: function () {
            this.$el.on('keydown.adp', this._onKeyDown.bind(this));
            this.$el.on('keyup.adp', this._onKeyUp.bind(this));
            this.$el.on('hotKey.adp', this._onHotKey.bind(this));
        },

        _bindTimepickerEvents: function () {
            this.$el.on('timeChange.adp', this._onTimeChange.bind(this));
        },

        isWeekend: function (day) {
            return this.opts.weekends.indexOf(day) !== -1;
        },

        _defineLocale: function (lang) {
            if (typeof lang == 'string') {
                this.loc = $.fn.datepicker.language[lang];
                if (!this.loc) {
                    console.warn('Can\'t find language "' + lang + '" in Datepicker.language, will use "ru" instead');
                    this.loc = $.extend(true, {}, $.fn.datepicker.language.ru)
                }

                this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, $.fn.datepicker.language[lang])
            } else {
                this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, lang)
            }

            if (this.opts.dateFormat) {
                this.loc.dateFormat = this.opts.dateFormat
            }

            if (this.opts.timeFormat) {
                this.loc.timeFormat = this.opts.timeFormat
            }

            if (this.opts.firstDay !== '') {
                this.loc.firstDay = this.opts.firstDay
            }

            if (this.opts.timepicker) {
                this.loc.dateFormat = [this.loc.dateFormat, this.loc.timeFormat].join(this.opts.dateTimeSeparator);
            }

            if (this.opts.onlyTimepicker) {
                this.loc.dateFormat = this.loc.timeFormat;
            }

            var boundary = this._getWordBoundaryRegExp;
            if (this.loc.timeFormat.match(boundary('aa')) ||
                this.loc.timeFormat.match(boundary('AA'))
            ) {
               this.ampm = true;
            }
        },

        _buildDatepickersContainer: function () {
            containerBuilt = true;
            $body.append('<div class="datepickers-container" id="datepickers-container"></div>');
            $datepickersContainer = $('#datepickers-container');
        },

        _buildBaseHtml: function () {
            var $appendTarget,
                $inline = $('<div class="datepicker-inline">');

            if(this.el.nodeName == 'INPUT') {
                if (!this.opts.inline) {
                    $appendTarget = $datepickersContainer;
                } else {
                    $appendTarget = $inline.insertAfter(this.$el)
                }
            } else {
                $appendTarget = $inline.appendTo(this.$el)
            }

            this.$datepicker = $(baseTemplate).appendTo($appendTarget);
            this.$content = $('.datepicker--content', this.$datepicker);
            this.$nav = $('.datepicker--nav', this.$datepicker);
        },

        _triggerOnChange: function () {
            if (!this.selectedDates.length) {
                // Prevent from triggering multiple onSelect callback with same argument (empty string) in IE10-11
                if (this._prevOnSelectValue === '') return;
                this._prevOnSelectValue = '';
                return this.opts.onSelect('', '', this);
            }

            var selectedDates = this.selectedDates,
                parsedSelected = datepicker.getParsedDate(selectedDates[0]),
                formattedDates,
                _this = this,
                dates = new Date(
                    parsedSelected.year,
                    parsedSelected.month,
                    parsedSelected.date,
                    parsedSelected.hours,
                    parsedSelected.minutes,
                    parsedSelected.seconds
                );

                formattedDates = selectedDates.map(function (date) {
                    return _this.formatDate(_this.loc.dateFormat, date)
                }).join(this.opts.multipleDatesSeparator);

            // Create new dates array, to separate it from original selectedDates
            if (this.opts.multipleDates || this.opts.range) {
                dates = selectedDates.map(function(date) {
                    var parsedDate = datepicker.getParsedDate(date);
                    return new Date(
                        parsedDate.year,
                        parsedDate.month,
                        parsedDate.date,
                        parsedDate.hours,
                        parsedDate.minutes,
                        parsedDate.seconds
                    );
                })
            }
            this._prevOnSelectValue = formattedDates;
            this.opts.onSelect(formattedDates, dates, this);
        },

        next: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month + 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year + 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year + 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },

        prev: function () {
            var d = this.parsedDate,
                o = this.opts;
            switch (this.view) {
                case 'days':
                    this.date = new Date(d.year, d.month - 1, 1);
                    if (o.onChangeMonth) o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
                    break;
                case 'months':
                    this.date = new Date(d.year - 1, d.month, 1);
                    if (o.onChangeYear) o.onChangeYear(this.parsedDate.year);
                    break;
                case 'years':
                    this.date = new Date(d.year - 10, 0, 1);
                    if (o.onChangeDecade) o.onChangeDecade(this.curDecade);
                    break;
            }
        },

        formatDate: function (string, date, calendar) {
            date = date || this.date;
            calendarDate = new (calendar || this.calendar)(date);
            var result = string,
                boundary = this._getWordBoundaryRegExp,
                locale = this.loc,
                leadingZero = datepicker.getLeadingZeroNum,
                decade = datepicker.getDecade(calendarDate),
                d = datepicker.getParsedDate(calendarDate),
                fullHours = d.fullHours,
                hours = d.hours,
                ampm = string.match(boundary('aa')) || string.match(boundary('AA')),
                dayPeriod = 'am',
                replacer = this._replacer,
                validHours;

            if (this.opts.timepicker && this.timepicker && ampm) {
                validHours = this.timepicker._getValidHoursFromDate(calendarDate, ampm);
                fullHours = leadingZero(validHours.hours);
                hours = validHours.hours;
                dayPeriod = validHours.dayPeriod;
            }

            switch (true) {
                case /@/.test(result):
                    result = result.replace(/@/, date.getTime());
                case /aa/.test(result):
                    result = replacer(result, boundary('aa'), dayPeriod);
                case /AA/.test(result):
                    result = replacer(result, boundary('AA'), dayPeriod.toUpperCase());
                case /dd/.test(result):
                    result = replacer(result, boundary('dd'), d.fullDate);
                case /d/.test(result):
                    result = replacer(result, boundary('d'), d.date);
                case /DD/.test(result):
                    result = replacer(result, boundary('DD'), locale.days[d.day]);
                case /D/.test(result):
                    result = replacer(result, boundary('D'), locale.daysShort[d.day]);
                case /mm/.test(result):
                    result = replacer(result, boundary('mm'), d.fullMonth);
                case /m/.test(result):
                    result = replacer(result, boundary('m'), d.month + 1);
                case /MM/.test(result):
                    result = replacer(result, boundary('MM'), this.getMonthName(date));
                case /M/.test(result):
                    result = replacer(result, boundary('M'), locale.monthsShort[d.month]);
                case /ss/.test(result):
                    result = replacer(result, boundary('ss'), d.fullSeconds);
                case /s/.test(result):
                    result = replacer(result, boundary('s'), d.seconds);
                case /ii/.test(result):
                    result = replacer(result, boundary('ii'), d.fullMinutes);
                case /i/.test(result):
                    result = replacer(result, boundary('i'), d.minutes);
                case /hh/.test(result):
                    result = replacer(result, boundary('hh'), fullHours);
                case /h/.test(result):
                    result = replacer(result, boundary('h'), hours);
                case /yyyy/.test(result):
                    result = replacer(result, boundary('yyyy'), d.year);
                case /yyyy1/.test(result):
                    result = replacer(result, boundary('yyyy1'), decade[0]);
                case /yyyy2/.test(result):
                    result = replacer(result, boundary('yyyy2'), decade[1]);
                case /yy/.test(result):
                    result = replacer(result, boundary('yy'), d.year.toString().slice(-2));
            }

            return result;
        },
        
        getMonthName: function (date) {
            var calendarDate = new this.calendar(date);
            return this.loc.customCalendars &&
                this.loc.customCalendars[this.calendar.calendarName] && 
                this.loc.customCalendars[this.calendar.calendarName][this.opts.monthsField] &&
                this.loc.customCalendars[this.calendar.calendarName][this.opts.monthsField][calendarDate.getMonth()]
                    || this.loc[this.opts.monthsField][calendarDate.getMonth()];
        },

        _replacer: function (str, reg, data) {
            return str.replace(reg, function (match, p1,p2,p3) {
                return p1 + data + p3;
            })
        },

        _getWordBoundaryRegExp: function (sign) {
            var symbols = '\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;';

            return new RegExp('(^|>|' + symbols + ')(' + sign + ')($|<|' + symbols + ')', 'g');
        },


        selectDate: function (date) {
            var _this = this,
                opts = _this.opts,
                d = _this.parsedDate,
                selectedDates = _this.selectedDates,
                len = selectedDates.length,
                newDate = '';

            if (Array.isArray(date)) {
                date.forEach(function (d) {
                    _this.selectDate(d)
                });
                return;
            }

            if (!(date instanceof Date)) return;

            this.lastSelectedDate = date;

            // Set new time values from Date
            if (this.timepicker) {
                this.timepicker._setTime(date);
            }

            // On this step timepicker will set valid values in it's instance
            _this._trigger('selectDate', date);

            // Set correct time values after timepicker's validation
            // Prevent from setting hours or minutes which values are lesser then `min` value or
            // greater then `max` value
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes)
                date.setSeconds(this.timepicker.seconds)
            }

            if (_this.view == 'days') {
                if (new this.calendar(date).getMonth() != new this.calendar(this.date).getMonth() && opts.moveToOtherMonthsOnSelect) {
                    newDate = new Date(date.getFullYear(), date.getMonth(), 1);
                }
            }

            if (_this.view == 'years') {
                if (date.getFullYear() != d.year && opts.moveToOtherYearsOnSelect) {
                    newDate = new Date(date.getFullYear(), 0, 1);
                }
            }

            if (newDate) {
                _this.silent = true;
                _this.date = newDate;
                _this.silent = false;
                _this.nav._render()
            }

            if (opts.multipleDates && !opts.range) { // Set priority to range functionality
                if (len === opts.multipleDates) return;
                if (!_this._isSelected(date)) {
                    _this.selectedDates.push(date);
                }
            } else if (opts.range) {
                if (len == 2) {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                    _this.maxRange = '';
                } else if (len == 1) {
                    _this.selectedDates.push(date);
                    if (!_this.maxRange){
                        _this.maxRange = date;
                    } else {
                        _this.minRange = date;
                    }
                    // Swap dates if they were selected via dp.selectDate() and second date was smaller then first
                    if (datepicker.bigger(_this.maxRange, _this.minRange)) {
                        _this.maxRange = _this.minRange;
                        _this.minRange = date;
                    }
                    _this.selectedDates = [_this.minRange, _this.maxRange]

                } else {
                    _this.selectedDates = [date];
                    _this.minRange = date;
                }
            } else {
                _this.selectedDates = [date];
            }

            _this._setInputValue();

            if (opts.onSelect) {
                _this._triggerOnChange();
            }

            if (opts.autoClose && !this.timepickerIsActive) {
                if (!opts.multipleDates && !opts.range) {
                    _this.hide();
                } else if (opts.range && _this.selectedDates.length == 2) {
                    _this.hide();
                }
            }

            _this.views[this.currentView]._render()
        },

        removeDate: function (date) {
            var selected = this.selectedDates,
                _this = this;

            if (!(date instanceof Date)) return;

            return selected.some(function (curDate, i) {
                if (datepicker.isSame(curDate, date)) {
                    selected.splice(i, 1);

                    if (!_this.selectedDates.length) {
                        _this.minRange = '';
                        _this.maxRange = '';
                        _this.lastSelectedDate = '';
                    } else {
                        _this.lastSelectedDate = _this.selectedDates[_this.selectedDates.length - 1];
                    }

                    _this.views[_this.currentView]._render();
                    _this._setInputValue();

                    if (_this.opts.onSelect) {
                        _this._triggerOnChange();
                    }

                    return true
                }
            })
        },

        today: function () {
            this.silent = true;
            this.view = this.opts.minView;
            this.silent = false;
            this.date = new Date();

            if (this.opts.todayButton instanceof Date) {
                this.selectDate(this.opts.todayButton)
            }
        },

        clear: function () {
            this.selectedDates = [];
            this.minRange = '';
            this.maxRange = '';
            this.views[this.currentView]._render();
            this._setInputValue();
            if (this.opts.onSelect) {
                this._triggerOnChange()
            }
        },

        /**
         * Updates datepicker options
         * @param {String|Object} param - parameter's name to update. If object then it will extend current options
         * @param {String|Number|Object} [value] - new param value
         */
        update: function (param, value) {
            var len = arguments.length,
                lastSelectedDate = this.lastSelectedDate;

            if (len == 2) {
                this.opts[param] = value;
            } else if (len == 1 && typeof param == 'object') {
                this.opts = $.extend(true, this.opts, param)
            }

            this._createShortCuts();
            this._syncWithMinMaxDates();
            this._defineLocale(this.opts.language);
            this.nav._addButtonsIfNeed();
            if (!this.opts.onlyTimepicker) this.nav._render();
            this.views[this.currentView]._render();

            if (this.elIsInput && !this.opts.inline) {
                this._setPositionClasses(this.opts.position);
                if (this.visible) {
                    this.setPosition(this.opts.position)
                }
            }

            if (this.opts.classes) {
                this.$datepicker.addClass(this.opts.classes)
            }

            if (this.opts.onlyTimepicker) {
                this.$datepicker.addClass('-only-timepicker-');
            }

            if (this.opts.timepicker) {
                if (lastSelectedDate) this.timepicker._handleDate(lastSelectedDate);
                this.timepicker._updateRanges();
                this.timepicker._updateCurrentTime();
                // Change hours and minutes if it's values have been changed through min/max hours/minutes
                if (lastSelectedDate) {
                    lastSelectedDate.setHours(this.timepicker.hours);
                    lastSelectedDate.setMinutes(this.timepicker.minutes);
                    lastSelectedDate.setSeconds(this.timepicker.seconds);
                }
            }

            this._setInputValue();

            return this;
        },

        _syncWithMinMaxDates: function () {
            var curTime = this.date.getTime();
            this.silent = true;
            if (this.minTime > curTime) {
                this.date = this.minDate;
            }

            if (this.maxTime < curTime) {
                this.date = this.maxDate;
            }
            this.silent = false;
        },

        _isSelected: function (checkDate, cellType) {
            var res = false;
            var that = this;
            this.selectedDates.some(function (date) {
                if (datepicker.isSame(date, checkDate, cellType, that.calendar)) {
                    res = date;
                    return true;
                }
            });
            return res;
        },

        _setInputValue: function () {
            var _this = this,
                opts = _this.opts,
                format = _this.loc.dateFormat,
                altFormat = opts.altFieldDateFormat,
                value = _this.selectedDates.map(function (date) {
                    return _this.formatDate(format, date)
                }),
                altValues;

            if (opts.altField && _this.$altField.length) {
                altValues = this.selectedDates.map(function (date) {
                    return _this.formatDate(altFormat, date)
                });
                altValues = altValues.join(this.opts.multipleDatesSeparator);
                this.$altField.val(altValues);
            }

            value = value.join(this.opts.multipleDatesSeparator);

            this.$el.val(value)
        },

        /**
         * Check if date is between minDate and maxDate
         * @param date {object} - date object
         * @param type {string} - cell type
         * @returns {boolean}
         * @private
         */
        _isInRange: function (date, type) {
            var time = date.getTime(),
                d = datepicker.getParsedDate(new this.calendar(date)),
                min = datepicker.getParsedDate(new this.calendar(this.minDate)),
                max = datepicker.getParsedDate(new this.calendar(this.maxDate)),
                dMinTime = new Date(d.year, d.month, min.date).getTime(),
                dMaxTime = new Date(d.year, d.month, max.date).getTime(),
                types = {
                    day: time >= this.minTime && time <= this.maxTime,
                    month: dMinTime >= this.minTime && dMaxTime <= this.maxTime,
                    year: d.year >= min.year && d.year <= max.year
                };
            return type ? types[type] : types.day
        },

        _getDimensions: function ($el) {
            var offset = $el.offset();

            return {
                width: $el.outerWidth(),
                height: $el.outerHeight(),
                left: offset.left,
                top: offset.top
            }
        },

        _getDateFromCell: function (cell) {
            var curDate = this.parsedDate,
                year = cell.data('year') || curDate.year,
                month = cell.data('month') == undefined ? curDate.month : cell.data('month'),
                date = cell.data('date') || 1;

            return new Date(year, month, date);
        },

        _setPositionClasses: function (pos) {
            pos = pos.split(' ');
            var main = pos[0],
                sec = pos[1],
                classes = 'datepicker -' + main + '-' + sec + '- -from-' + main + '-';

            if (this.visible) classes += ' active';

            this.$datepicker
                .removeAttr('class')
                .addClass(classes);
        },

        setPosition: function (position) {
            position = position || this.opts.position;

            var dims = this._getDimensions(this.$el),
                selfDims = this._getDimensions(this.$datepicker),
                pos = position.split(' '),
                top, left,
                offset = this.opts.offset,
                main = pos[0],
                secondary = pos[1];

            switch (main) {
                case 'top':
                    top = dims.top - selfDims.height - offset;
                    break;
                case 'right':
                    left = dims.left + dims.width + offset;
                    break;
                case 'bottom':
                    top = dims.top + dims.height + offset;
                    break;
                case 'left':
                    left = dims.left - selfDims.width - offset;
                    break;
            }

            switch(secondary) {
                case 'top':
                    top = dims.top;
                    break;
                case 'right':
                    left = dims.left + dims.width - selfDims.width;
                    break;
                case 'bottom':
                    top = dims.top + dims.height - selfDims.height;
                    break;
                case 'left':
                    left = dims.left;
                    break;
                case 'center':
                    if (/left|right/.test(main)) {
                        top = dims.top + dims.height/2 - selfDims.height/2;
                    } else {
                        left = dims.left + dims.width/2 - selfDims.width/2;
                    }
            }

            this.$datepicker
                .css({
                    left: left,
                    top: top
                })
        },

        show: function () {
            var onShow = this.opts.onShow;

            this.setPosition(this.opts.position);
            this.$datepicker.addClass('active');
            this.visible = true;

            if (onShow) {
                this._bindVisionEvents(onShow)
            }
        },

        hide: function () {
            var onHide = this.opts.onHide;

            this.$datepicker
                .removeClass('active')
                .css({
                    left: '-100000px'
                });

            this.focused = '';
            this.keys = [];

            this.inFocus = false;
            this.visible = false;
            this.$el.blur();

            if (onHide) {
                this._bindVisionEvents(onHide)
            }
        },

        down: function (date) {
            this._changeView(date, 'down');
        },

        up: function (date) {
            this._changeView(date, 'up');
        },

        _bindVisionEvents: function (event) {
            this.$datepicker.off('transitionend.dp');
            event(this, false);
            this.$datepicker.one('transitionend.dp', event.bind(this, this, true))
        },

        _changeView: function (date, dir) {
            date = date || this.focused || this.date;

            var nextView = dir == 'up' ? this.viewIndex + 1 : this.viewIndex - 1;
            if (nextView > 2) nextView = 2;
            if (nextView < 0) nextView = 0;

            this.silent = true;
            this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            this.silent = false;
            this.view = this.viewIndexes[nextView];

        },

        _handleHotKey: function (key) {
            var date = datepicker.getParsedDate(this._getFocusedDate()),
                focusedParsed,
                o = this.opts,
                newDate,
                totalDaysInNextMonth,
                monthChanged = false,
                yearChanged = false,
                decadeChanged = false,
                y = date.year,
                m = date.month,
                d = date.date;

            switch (key) {
                case 'ctrlRight':
                case 'ctrlUp':
                    m += 1;
                    monthChanged = true;
                    break;
                case 'ctrlLeft':
                case 'ctrlDown':
                    m -= 1;
                    monthChanged = true;
                    break;
                case 'shiftRight':
                case 'shiftUp':
                    yearChanged = true;
                    y += 1;
                    break;
                case 'shiftLeft':
                case 'shiftDown':
                    yearChanged = true;
                    y -= 1;
                    break;
                case 'altRight':
                case 'altUp':
                    decadeChanged = true;
                    y += 10;
                    break;
                case 'altLeft':
                case 'altDown':
                    decadeChanged = true;
                    y -= 10;
                    break;
                case 'ctrlShiftUp':
                    this.up();
                    break;
            }

            totalDaysInNextMonth = datepicker.getDaysCount(new Date(y,m));
            newDate = new Date(y,m,d);

            // If next month has less days than current, set date to total days in that month
            if (totalDaysInNextMonth < d) d = totalDaysInNextMonth;

            // Check if newDate is in valid range
            if (newDate.getTime() < this.minTime) {
                newDate = this.minDate;
            } else if (newDate.getTime() > this.maxTime) {
                newDate = this.maxDate;
            }

            this.focused = newDate;

            focusedParsed = datepicker.getParsedDate(newDate);
            if (monthChanged && o.onChangeMonth) {
                o.onChangeMonth(focusedParsed.month, focusedParsed.year)
            }
            if (yearChanged && o.onChangeYear) {
                o.onChangeYear(focusedParsed.year)
            }
            if (decadeChanged && o.onChangeDecade) {
                o.onChangeDecade(this.curDecade)
            }
        },

        _registerKey: function (key) {
            var exists = this.keys.some(function (curKey) {
                return curKey == key;
            });

            if (!exists) {
                this.keys.push(key)
            }
        },

        _unRegisterKey: function (key) {
            var index = this.keys.indexOf(key);

            this.keys.splice(index, 1);
        },

        _isHotKeyPressed: function () {
            var currentHotKey,
                found = false,
                _this = this,
                pressedKeys = this.keys.sort();

            for (var hotKey in hotKeys) {
                currentHotKey = hotKeys[hotKey];
                if (pressedKeys.length != currentHotKey.length) continue;

                if (currentHotKey.every(function (key, i) { return key == pressedKeys[i]})) {
                    _this._trigger('hotKey', hotKey);
                    found = true;
                }
            }

            return found;
        },

        _trigger: function (event, args) {
            this.$el.trigger(event, args)
        },

        _focusNextCell: function (keyCode, type) {
            type = type || this.cellType;

            var date = datepicker.getParsedDate(this._getFocusedDate()),
                y = date.year,
                m = date.month,
                d = date.date;

            if (this._isHotKeyPressed()){
                return;
            }

            switch(keyCode) {
                case 37: // left
                    type == 'day' ? (d -= 1) : '';
                    type == 'month' ? (m -= 1) : '';
                    type == 'year' ? (y -= 1) : '';
                    break;
                case 38: // up
                    type == 'day' ? (d -= 7) : '';
                    type == 'month' ? (m -= 3) : '';
                    type == 'year' ? (y -= 4) : '';
                    break;
                case 39: // right
                    type == 'day' ? (d += 1) : '';
                    type == 'month' ? (m += 1) : '';
                    type == 'year' ? (y += 1) : '';
                    break;
                case 40: // down
                    type == 'day' ? (d += 7) : '';
                    type == 'month' ? (m += 3) : '';
                    type == 'year' ? (y += 4) : '';
                    break;
            }

            var nd = new Date(y,m,d);
            if (nd.getTime() < this.minTime) {
                nd = this.minDate;
            } else if (nd.getTime() > this.maxTime) {
                nd = this.maxDate;
            }

            this.focused = nd;

        },

        _getFocusedDate: function () {
            var focused  = this.focused || this.selectedDates[this.selectedDates.length - 1],
                d = this.parsedDate;

            if (!focused) {
                switch (this.view) {
                    case 'days':
                        focused = new Date(d.year, d.month, new Date().getDate());
                        break;
                    case 'months':
                        focused = new Date(d.year, d.month, 1);
                        break;
                    case 'years':
                        focused = new Date(d.year, 0, 1);
                        break;
                }
            }

            return focused;
        },

        _getCell: function (date, type) {
            type = type || this.cellType;

            var d = datepicker.getParsedDate(date),
                selector = '.datepicker--cell[data-year="' + d.year + '"]',
                $cell;

            switch (type) {
                case 'month':
                    selector = '[data-month="' + d.month + '"]';
                    break;
                case 'day':
                    selector += '[data-month="' + d.month + '"][data-date="' + d.date + '"]';
                    break;
            }
            $cell = this.views[this.currentView].$el.find(selector);

            return $cell.length ? $cell : $('');
        },

        destroy: function () {
            var _this = this;
            _this.$el
                .off('.adp')
                .data('datepicker', '');

            _this.selectedDates = [];
            _this.focused = '';
            _this.views = {};
            _this.keys = [];
            _this.minRange = '';
            _this.maxRange = '';

            if (_this.opts.inline || !_this.elIsInput) {
                _this.$datepicker.closest('.datepicker-inline').remove();
            } else {
                _this.$datepicker.remove();
            }
        },

        _handleAlreadySelectedDates: function (alreadySelected, selectedDate) {
            if (this.opts.range) {
                if (!this.opts.toggleSelected) {
                    // Add possibility to select same date when range is true
                    if (this.selectedDates.length != 2) {
                        this._trigger('clickCell', selectedDate);
                    }
                } else {
                    this.removeDate(selectedDate);
                }
            } else if (this.opts.toggleSelected){
                this.removeDate(selectedDate);
            }

            // Change last selected date to be able to change time when clicking on this cell
            if (!this.opts.toggleSelected) {
                this.lastSelectedDate = alreadySelected;
                if (this.opts.timepicker) {
                    this.timepicker._setTime(alreadySelected);
                    this.timepicker.update();
                }
            }
        },

        _onShowEvent: function (e) {
            if (!this.visible) {
                this.show();
            }
        },

        _onBlur: function () {
            if (!this.inFocus && this.visible) {
                this.hide();
            }
        },

        _onMouseDownDatepicker: function (e) {
            this.inFocus = true;
        },

        _onMouseUpDatepicker: function (e) {
            this.inFocus = false;
            e.originalEvent.inFocus = true;
            if (!e.originalEvent.timepickerFocus) this.$el.focus();
        },

        _onKeyUpGeneral: function (e) {
            var val = this.$el.val();

            if (!val) {
                this.clear();
            }
        },

        _onResize: function () {
            if (this.visible) {
                this.setPosition();
            }
        },

        _onMouseUpBody: function (e) {
            if (e.originalEvent.inFocus) return;

            if (this.visible && !this.inFocus) {
                this.hide();
            }
        },

        _onMouseUpEl: function (e) {
            e.originalEvent.inFocus = true;
            setTimeout(this._onKeyUpGeneral.bind(this),4);
        },

        _onKeyDown: function (e) {
            var code = e.which;
            this._registerKey(code);

            // Arrows
            if (code >= 37 && code <= 40) {
                e.preventDefault();
                this._focusNextCell(code);
            }

            // Enter
            if (code == 13) {
                if (this.focused) {
                    if (this._getCell(this.focused).hasClass('-disabled-')) return;
                    if (this.view != this.opts.minView) {
                        this.down()
                    } else {
                        var alreadySelected = this._isSelected(this.focused, this.cellType);

                        if (!alreadySelected) {
                            if (this.timepicker) {
                                this.focused.setHours(this.timepicker.hours);
                                this.focused.setMinutes(this.timepicker.minutes);
                                this.focused.setSeconds(this.timepicker.seconds);
                            }
                            this.selectDate(this.focused);
                            return;
                        }
                        this._handleAlreadySelectedDates(alreadySelected, this.focused)
                    }
                }
            }

            // Esc
            if (code == 27) {
                this.hide();
            }
        },

        _onKeyUp: function (e) {
            var code = e.which;
            this._unRegisterKey(code);
        },

        _onHotKey: function (e, hotKey) {
            this._handleHotKey(hotKey);
        },

        _onMouseEnterCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell'),
                date = this._getDateFromCell($cell);

            // Prevent from unnecessary rendering and setting new currentDate
            this.silent = true;

            if (this.focused) {
                this.focused = ''
            }

            $cell.addClass('-focus-');

            this.focused = date;
            this.silent = false;

            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this.focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
                this.views[this.currentView]._update();
            }
        },

        _onMouseLeaveCell: function (e) {
            var $cell = $(e.target).closest('.datepicker--cell');

            $cell.removeClass('-focus-');

            this.silent = true;
            this.focused = '';
            this.silent = false;
        },

        _onTimeChange: function (e, h, m, s) {
            var date = new Date(),
                selectedDates = this.selectedDates,
                selected = false;

            if (selectedDates.length) {
                selected = true;
                date = this.lastSelectedDate;
            }

            date.setHours(h);
            date.setMinutes(m);
            date.setSeconds(s);

            if (!selected && !this._getCell(date).hasClass('-disabled-')) {
                this.selectDate(date);
            } else {
                this._setInputValue();
                if (this.opts.onSelect) {
                    this._triggerOnChange();
                }
            }
        },

        _onClickCell: function (e, date) {
            if (this.timepicker) {
                date.setHours(this.timepicker.hours);
                date.setMinutes(this.timepicker.minutes);
                date.setSeconds(this.timepicker.seconds)
            }
            this.selectDate(date);
        },

        set focused(val) {
            if (!val && this.focused) {
                var $cell = this._getCell(this.focused);

                if ($cell.length) {
                    $cell.removeClass('-focus-')
                }
            }
            this._focused = val;
            if (this.opts.range && this.selectedDates.length == 1) {
                this.minRange = this.selectedDates[0];
                this.maxRange = '';
                if (datepicker.less(this.minRange, this._focused)) {
                    this.maxRange = this.minRange;
                    this.minRange = '';
                }
            }
            if (this.silent) return;
            this.date = val;
        },

        get focused() {
            return this._focused;
        },

        get parsedDate() {
            return datepicker.getParsedDate(this.date);
        },

        set date (val) {
            if (!(val instanceof Date)) return;

            this.currentDate = val;

            if (this.inited && !this.silent) {
                this.views[this.view]._render();
                this.nav._render();
                if (this.visible && this.elIsInput) {
                    this.setPosition();
                }
            }
            return val;
        },

        get date () {
            return this.currentDate
        },

        set view (val) {
            this.viewIndex = this.viewIndexes.indexOf(val);

            if (this.viewIndex < 0) {
                return;
            }

            this.prevView = this.currentView;
            this.currentView = val;

            if (this.inited) {
                if (!this.views[val]) {
                    this.views[val] = new  $.fn.datepicker.Body(this, val, this.opts)
                } else {
                    this.views[val]._render();
                }

                this.views[this.prevView].hide();
                this.views[val].show();
                this.nav._render();

                if (this.opts.onChangeView) {
                    this.opts.onChangeView(val)
                }
                if (this.elIsInput && this.visible) this.setPosition();
            }

            return val
        },

        get view() {
            return this.currentView;
        },

        get cellType() {
            return this.view.substring(0, this.view.length - 1)
        },

        get minTime() {
            var min = datepicker.getParsedDate(this.minDate);
            return new Date(min.year, min.month, min.date).getTime()
        },

        get maxTime() {
            var max = datepicker.getParsedDate(this.maxDate);
            return new Date(max.year, max.month, max.date).getTime()
        },

        get curDecade() {
            return datepicker.getDecade(this.date)
        },

        get calendar() {
            switch (this.opts.calendar) {
                case 'jalali':
                    return JalaliDate;
                default: 
                    return Date;
            }
        }
    };

    //  Utils
    // -------------------------------------------------

    datepicker.getDaysCount = function (date, calendar) {
        calendar = calendar || Date;
        date = new calendar(date);
        return date.getCurrentMonthDayCount
            ? date.getCurrentMonthDayCount()
            : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    datepicker.getParsedDate = function (date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            fullMonth: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1, // One based
            date: date.getDate(),
            fullDate: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            fullHours:  date.getHours() < 10 ? '0' + date.getHours() :  date.getHours() ,
            minutes: date.getMinutes(),
            fullMinutes:  date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes(),
            seconds: date.getSeconds(),
            fullSeconds:  date.getSeconds() < 10 ? '0' + date.getSeconds() :  date.getSeconds()
        }
    };

    datepicker.getDecade = function (date) {
        var firstYear = Math.floor(date.getFullYear() / 10) * 10;

        return [firstYear, firstYear + 9];
    };

    datepicker.template = function (str, data) {
        return str.replace(/#\{([\w]+)\}/g, function (source, match) {
            if (data[match] || data[match] === 0) {
                return data[match]
            }
        });
    };

    datepicker.isSame = function (date1, date2, type, calendar) {
        if (!date1 || !date2) return false;
        calendar = calendar || Date;
        var d1 = datepicker.getParsedDate(new calendar(date1)),
            d2 = datepicker.getParsedDate(new calendar(date2)),
            _type = type ? type : 'day',

            conditions = {
                day: d1.date == d2.date && d1.month == d2.month && d1.year == d2.year,
                month: d1.month == d2.month && d1.year == d2.year,
                year: d1.year == d2.year
            };

        return conditions[_type];
    };

    datepicker.less = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() < dateCompareTo.getTime();
    };

    datepicker.bigger = function (dateCompareTo, date, type) {
        if (!dateCompareTo || !date) return false;
        return date.getTime() > dateCompareTo.getTime();
    };

    datepicker.getLeadingZeroNum = function (num) {
        return parseInt(num) < 10 ? '0' + num : num;
    };

    /**
     * Returns copy of date with hours and minutes equals to 0
     * @param date {Date}
     */
    datepicker.resetTime = function (date) {
        if (typeof date != 'object') return;
        date = datepicker.getParsedDate(date);
        return new Date(date.year, date.month, date.date)
    };

    $.fn.datepicker = function ( options ) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this,  pluginName,
                    new Datepicker( this, options ));
            } else {
                var _this = $.data(this, pluginName);

                _this.opts = $.extend(true, _this.opts, options);
                _this.update();
            }
        });
    };

    $.fn.datepicker.Constructor = Datepicker;

    $.fn.datepicker.language = {
        ru: {
            days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            daysShort: ['Вос','Пон','Вто','Сре','Чет','Пят','Суб'],
            daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            today: 'Сегодня',
            clear: 'Очистить',
            dateFormat: 'dd.mm.yyyy',
            timeFormat: 'hh:ii',
            firstDay: 1
        }
    };

    $(function () {
        $(autoInitSelector).datepicker();
    })

})();

;(function () {
    var templates = {
        days:'' +
        '<div class="datepicker--days datepicker--body">' +
        '<div class="datepicker--days-names"></div>' +
        '<div class="datepicker--cells datepicker--cells-days"></div>' +
        '</div>',
        months: '' +
        '<div class="datepicker--months datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-months"></div>' +
        '</div>',
        years: '' +
        '<div class="datepicker--years datepicker--body">' +
        '<div class="datepicker--cells datepicker--cells-years"></div>' +
        '</div>'
        },
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Body = function (d, type, opts) {
        this.d = d;
        this.type = type;
        this.opts = opts;
        this.$el = $('');

        if (this.opts.onlyTimepicker) return;
        this.init();
    };

    datepicker.Body.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._render();

            this._bindEvents();
        },

        _bindEvents: function () {
            this.$el.on('click', '.datepicker--cell', $.proxy(this._onClickCell, this));
        },

        _buildBaseHtml: function () {
            this.$el = $(templates[this.type]).appendTo(this.d.$content);
            this.$names = $('.datepicker--days-names', this.$el);
            this.$cells = $('.datepicker--cells', this.$el);
        },

        _getDayNamesHtml: function (firstDay, curDay, html, i) {
            curDay = curDay != undefined ? curDay : firstDay;
            html = html ? html : '';
            i = i != undefined ? i : 0;

            if (i > 7) return html;
            if (curDay == 7) return this._getDayNamesHtml(firstDay, 0, html, ++i);

            html += '<div class="datepicker--day-name' + (this.d.isWeekend(curDay) ? " -weekend-" : "") + '">' + this.d.loc.daysMin[curDay] + '</div>';

            return this._getDayNamesHtml(firstDay, ++curDay, html, ++i);
        },

        _getCellContents: function (date, type) {
            var classes = "datepicker--cell datepicker--cell-" + type,
                calendarDate = new this.d.calendar(date),
                currentDate = new Date(),
                parent = this.d,
                minRange = dp.resetTime(parent.minRange),
                maxRange = dp.resetTime(parent.maxRange),
                opts = parent.opts,
                d = dp.getParsedDate(date),
                dForDisplay = dp.getParsedDate(calendarDate),
                render = {},
                html = dForDisplay.date,
                selectedDate = new this.d.calendar(this.d.date);

            switch (type) {
                case 'day':
                    if (parent.isWeekend(d.day)) classes += " -weekend-";
                    if (dForDisplay.month != selectedDate.getMonth()) {
                        classes += " -other-month-";
                        if (!opts.selectOtherMonths) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherMonths) html = '';
                    }
                    break;
                case 'month':
                    html = parent.getMonthName(date);
                    break;
                case 'year':
                    var decade = parent.curDecade;
                    html = dForDisplay.year;
                    if (d.year < decade[0] || d.year > decade[1]) {
                        classes += ' -other-decade-';
                        if (!opts.selectOtherYears) {
                            classes += " -disabled-";
                        }
                        if (!opts.showOtherYears) html = '';
                    }
                    break;
            }

            if (opts.onRenderCell) {
                render = opts.onRenderCell(date, type) || {};
                html = render.html ? render.html : html;
                classes += render.classes ? ' ' + render.classes : '';
            }

            if (opts.range) {
                if (dp.isSame(minRange, date, type)) classes += ' -range-from-';
                if (dp.isSame(maxRange, date, type)) classes += ' -range-to-';

                if (parent.selectedDates.length == 1 && parent.focused) {
                    if (
                        (dp.bigger(minRange, date) && dp.less(parent.focused, date)) ||
                        (dp.less(maxRange, date) && dp.bigger(parent.focused, date)))
                    {
                        classes += ' -in-range-'
                    }

                    if (dp.less(maxRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-from-'
                    }
                    if (dp.bigger(minRange, date) && dp.isSame(parent.focused, date)) {
                        classes += ' -range-to-'
                    }

                } else if (parent.selectedDates.length == 2) {
                    if (dp.bigger(minRange, date) && dp.less(maxRange, date)) {
                        classes += ' -in-range-'
                    }
                }
            }

            
            if (dp.isSame(currentDate, date, type, this.d.calendar)) classes += ' -current-';
            if (parent.focused && dp.isSame(date, parent.focused, type, this.d.calendar)) classes += ' -focus-';
            if (parent._isSelected(date, type)) classes += ' -selected-';
            if (!parent._isInRange(date, type) || render.disabled) classes += ' -disabled-';

            return {
                html: html,
                classes: classes
            }
        },

        /**
         * Calculates days number to render. Generates days html and returns it.
         * @param {object} date - Date object
         * @returns {string}
         * @private
         */
        _getDaysHtml: function (date) {
            var totalMonthDays = dp.getDaysCount(date, this.d.calendar),
                calendarDate = new this.d.calendar(date),
                firstMonthDay = new this.d.calendar(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay(),
                lastMonthDay = new this.d.calendar(calendarDate.getFullYear(), calendarDate.getMonth(), totalMonthDays).getDay(),
                daysFromPevMonth = firstMonthDay - this.d.loc.firstDay,
                daysFromNextMonth = 6 - lastMonthDay + this.d.loc.firstDay;

            daysFromPevMonth = daysFromPevMonth < 0 ? daysFromPevMonth + 7 : daysFromPevMonth;
            daysFromNextMonth = daysFromNextMonth > 6 ? daysFromNextMonth - 7 : daysFromNextMonth;

            var startDayIndex = -daysFromPevMonth + 1,
                m, y,
                html = '';

            for (var i = startDayIndex, max = totalMonthDays + daysFromNextMonth; i <= max; i++) {
                y = calendarDate.getFullYear();
                m = calendarDate.getMonth();
                var currentDate = new this.d.calendar(y, m, i);
                if (currentDate.getNativeDate) {
                    currentDate = currentDate.getNativeDate();
                }

                html += this._getDayHtml(currentDate);
            }

            return html;
        },

        _getDayHtml: function (date) {
           var content = this._getCellContents(date, 'day');

            return '<div class="' + content.classes + '" ' +
                'data-date="' + date.getDate() + '" ' +
                'data-month="' + date.getMonth() + '" ' +
                'data-year="' + date.getFullYear() + '">' + content.html + '</div>';
        },

        /**
         * Generates months html
         * @param {object} date - date instance
         * @returns {string}
         * @private
         */
        _getMonthsHtml: function (date) {
            var html = '',
                d = dp.getParsedDate(date),
                calendarDate = new this.d.calendar(date),
                i = 0;

            while (i < 12) {
                var currentMonth = new this.d.calendar(calendarDate.getFullYear(), i, 1);
                if (currentMonth.getNativeDate) {
                    currentMonth = currentMonth.getNativeDate();
                }
                html += this._getMonthHtml(currentMonth);
                i++
            }

            return html;
        },

        _getMonthHtml: function (date) {
            var content = this._getCellContents(date, 'month');

            return '<div class="' + content.classes + '" data-month="' + date.getMonth() + '" data-date="' + date.getDate() + '">' + content.html + '</div>'
        },

        _getYearsHtml: function (date) {
            var d = dp.getParsedDate(date),
                decade = dp.getDecade(date),
                firstYear = decade[0] - 1,
                html = '',
                i = firstYear;

            for (i; i <= decade[1] + 1; i++) {
                html += this._getYearHtml(new Date(i , 0));
            }

            return html;
        },

        _getYearHtml: function (date) {
            var content = this._getCellContents(date, 'year');

            return '<div class="' + content.classes + '" data-year="' + date.getFullYear() + '">' + content.html + '</div>'
        },

        _renderTypes: {
            days: function () {
                var dayNames = this._getDayNamesHtml(this.d.loc.firstDay),
                    days = this._getDaysHtml(this.d.currentDate);

                this.$cells.html(days);
                this.$names.html(dayNames)
            },
            months: function () {
                var html = this._getMonthsHtml(this.d.currentDate);

                this.$cells.html(html)
            },
            years: function () {
                var html = this._getYearsHtml(this.d.currentDate);

                this.$cells.html(html)
            }
        },

        _render: function () {
            if (this.opts.onlyTimepicker) return;
            this._renderTypes[this.type].bind(this)();
        },

        _update: function () {
            var $cells = $('.datepicker--cell', this.$cells),
                _this = this,
                classes,
                $cell,
                date;
            $cells.each(function (cell, i) {
                $cell = $(this);
                date = _this.d._getDateFromCell($(this));
                classes = _this._getCellContents(date, _this.d.cellType);
                $cell.attr('class',classes.classes)
            });
        },

        show: function () {
            if (this.opts.onlyTimepicker) return;
            this.$el.addClass('active');
            this.acitve = true;
        },

        hide: function () {
            this.$el.removeClass('active');
            this.active = false;
        },

        //  Events
        // -------------------------------------------------

        _handleClick: function (el) {
            var date = el.data('date') || 1,
                month = el.data('month') || 0,
                year = el.data('year') || this.d.parsedDate.year,
                dp = this.d;
            // Change view if min view does not reach yet
            if (dp.view != this.opts.minView) {
                dp.down(new Date(year, month, date));
                return;
            }
            // Select date if min view is reached
            var selectedDate = new Date(year, month, date),
                alreadySelected = this.d._isSelected(selectedDate, this.d.cellType);

            if (!alreadySelected) {
                dp._trigger('clickCell', selectedDate);
                return;
            }

            dp._handleAlreadySelectedDates.bind(dp, alreadySelected, selectedDate)();

        },

        _onClickCell: function (e) {
            var $el = $(e.target).closest('.datepicker--cell');

            if ($el.hasClass('-disabled-')) return;

            this._handleClick.bind(this)($el);
        }
    };
})();

;(function () {
    var template = '' +
        '<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div>' +
        '<div class="datepicker--nav-title">#{title}</div>' +
        '<div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',
        buttonsContainerTemplate = '<div class="datepicker--buttons"></div>',
        button = '<span class="datepicker--button" data-action="#{action}">#{label}</span>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Navigation = function (d, opts) {
        this.d = d;
        this.opts = opts;

        this.$buttonsContainer = '';

        this.init();
    };

    datepicker.Navigation.prototype = {
        init: function () {
            this._buildBaseHtml();
            this._bindEvents();
        },

        _bindEvents: function () {
            this.d.$nav.on('click', '.datepicker--nav-action', $.proxy(this._onClickNavButton, this));
            this.d.$nav.on('click', '.datepicker--nav-title', $.proxy(this._onClickNavTitle, this));
            this.d.$datepicker.on('click', '.datepicker--button', $.proxy(this._onClickNavButton, this));
        },

        _buildBaseHtml: function () {
            if (!this.opts.onlyTimepicker) {
                this._render();
            }
            this._addButtonsIfNeed();
        },

        _addButtonsIfNeed: function () {
            if (this.opts.todayButton) {
                this._addButton('today')
            }
            if (this.opts.clearButton) {
                this._addButton('clear')
            }
        },

        _render: function () {
            var title = this._getTitle(this.d.currentDate),
                html = dp.template(template, $.extend({title: title}, this.opts));
            this.d.$nav.html(html);
            if (this.d.view == 'years') {
                $('.datepicker--nav-title', this.d.$nav).addClass('-disabled-');
            }
            this.setNavStatus();
        },

        _getTitle: function (date) {
            return this.d.formatDate(this.opts.navTitles[this.d.view], date)
        },

        _addButton: function (type) {
            if (!this.$buttonsContainer.length) {
                this._addButtonsContainer();
            }

            var data = {
                    action: type,
                    label: this.d.loc[type]
                },
                html = dp.template(button, data);

            if ($('[data-action=' + type + ']', this.$buttonsContainer).length) return;
            this.$buttonsContainer.append(html);
        },

        _addButtonsContainer: function () {
            this.d.$datepicker.append(buttonsContainerTemplate);
            this.$buttonsContainer = $('.datepicker--buttons', this.d.$datepicker);
        },

        setNavStatus: function () {
            if (!(this.opts.minDate || this.opts.maxDate) || !this.opts.disableNavWhenOutOfRange) return;

            var date = this.d.parsedDate,
                m = date.month,
                y = date.year,
                d = date.date;

            switch (this.d.view) {
                case 'days':
                    if (!this.d._isInRange(new Date(y, m-1, 1), 'month')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y, m+1, 1), 'month')) {
                        this._disableNav('next')
                    }
                    break;
                case 'months':
                    if (!this.d._isInRange(new Date(y-1, m, d), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(y+1, m, d), 'year')) {
                        this._disableNav('next')
                    }
                    break;
                case 'years':
                    var decade = dp.getDecade(this.d.date);
                    if (!this.d._isInRange(new Date(decade[0] - 1, 0, 1), 'year')) {
                        this._disableNav('prev')
                    }
                    if (!this.d._isInRange(new Date(decade[1] + 1, 0, 1), 'year')) {
                        this._disableNav('next')
                    }
                    break;
            }
        },

        _disableNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).addClass('-disabled-')
        },

        _activateNav: function (nav) {
            $('[data-action="' + nav + '"]', this.d.$nav).removeClass('-disabled-')
        },

        _onClickNavButton: function (e) {
            var $el = $(e.target).closest('[data-action]'),
                action = $el.data('action');

            this.d[action]();
        },

        _onClickNavTitle: function (e) {
            if ($(e.target).hasClass('-disabled-')) return;

            if (this.d.view == 'days') {
                return this.d.view = 'months'
            }

            this.d.view = 'years';
        }
    }

})();

;(function () {
    var template = '<div class="datepicker--time">' +
        '<div class="datepicker--time-current">' +
        '   <span class="datepicker--time-current-hours">#{hourVisible}</span>' +
        '   <span class="datepicker--time-current-colon">:</span>' +
        '   <span class="datepicker--time-current-minutes">#{minValue}</span>' +
        '   <span class="datepicker--time-current-colon">:</span>' +
        '   <span class="datepicker--time-current-seconds">#{secValue}</span>' +
        '</div>' +
        '<div class="datepicker--time-sliders">' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>' +
        '   </div>' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>' +
        '   </div>' +
        '   <div class="datepicker--time-row">' +
        '      <input type="range" name="seconds" value="#{secValue}" min="#{secMin}" max="#{secMax}" step="#{secStep}"/>' +
        '   </div>' +
        '</div>' +
        '</div>',
        datepicker = $.fn.datepicker,
        dp = datepicker.Constructor;

    datepicker.Timepicker = function (inst, opts) {
        this.d = inst;
        this.opts = opts;

        this.init();
    };

    datepicker.Timepicker.prototype = {
        init: function () {
            var input = 'input';
            this._setTime(this.d.date);
            this._buildHTML();

            if (navigator.userAgent.match(/trident/gi)) {
                input = 'change';
            }

            this.d.$el.on('selectDate', this._onSelectDate.bind(this));
            this.$ranges.on(input, this._onChangeRange.bind(this));
            this.$ranges.on('mouseup', this._onMouseUpRange.bind(this));
            this.$ranges.on('mousemove focus ', this._onMouseEnterRange.bind(this));
            this.$ranges.on('mouseout blur', this._onMouseOutRange.bind(this));
        },

        _setTime: function (date) {
            var _date = dp.getParsedDate(date);

            this._handleDate(date);
            this.hours = _date.hours < this.minHours ? this.minHours : _date.hours;
            this.minutes = _date.minutes < this.minMinutes ? this.minMinutes : _date.minutes;
            this.seconds = _date.seconds < this.minSeconds ? this.minSeconds : _date.seconds;
        },

        /**
         * Sets minHours and minMinutes from date (usually it's a minDate)
         * Also changes minMinutes if current hours are bigger then @date hours
         * @param date {Date}
         * @private
         */
        _setMinTimeFromDate: function (date) {
            this.minHours = date.getHours();
            this.minMinutes = date.getMinutes();
            this.minSeconds = date.getSeconds();

            // If, for example, min hours are 10, and current hours are 12,
            // update minMinutes to default value, to be able to choose whole range of values
            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() > date.getHours()) {
                    this.minMinutes = this.opts.minMinutes;
                }
            }
        },

        _setMaxTimeFromDate: function (date) {
            this.maxHours = date.getHours();
            this.maxMinutes = date.getMinutes();
            this.maxSeconds = date.getSeconds();

            if (this.d.lastSelectedDate) {
                if (this.d.lastSelectedDate.getHours() < date.getHours()) {
                    this.maxMinutes = this.opts.maxMinutes;
                }
            }
        },

        _setDefaultMinMaxTime: function () {
            var maxHours = 23,
                maxMinutes = 59,
                maxSeconds = 59,
                opts = this.opts;

            this.minHours = opts.minHours < 0 || opts.minHours > maxHours ? 0 : opts.minHours;
            this.minMinutes = opts.minMinutes < 0 || opts.minMinutes > maxMinutes ? 0 : opts.minMinutes;
            this.maxHours = opts.maxHours < 0 || opts.maxHours > maxHours ? maxHours : opts.maxHours;
            this.maxMinutes = opts.maxMinutes < 0 || opts.maxMinutes > maxMinutes ? maxMinutes : opts.maxMinutes;
            this.minSeconds = opts.minSeconds < 0 || opts.minSeconds > maxSeconds ? 0 : opts.minSeconds;
            this.maxSeconds = opts.maxSeconds < 0 || opts.maxSeconds > maxSeconds ? maxSeconds : opts.maxSeconds;
        },

        /**
         * Looks for min/max hours/minutes and if current values
         * are out of range sets valid values.
         * @private
         */
        _validateHoursMinutes: function (date) {
            if (this.hours < this.minHours) {
                this.hours = this.minHours;
            } else if (this.hours > this.maxHours) {
                this.hours = this.maxHours;
            }

            if (this.minutes < this.minMinutes) {
                this.minutes = this.minMinutes;
            } else if (this.minutes > this.maxMinutes) {
                this.minutes = this.maxMinutes;
            }

            if (this.seconds < this.minSeconds) {
                this.seconds = this.minSeconds;
            } else if (this.seconds > this.maxSeconds) {
                this.seconds = this.maxSeconds;
            }
        },

        _buildHTML: function () {
            var lz = dp.getLeadingZeroNum,
                data = {
                    hourMin: this.minHours,
                    hourMax: lz(this.maxHours),
                    hourStep: this.opts.hoursStep,
                    hourValue: this.hours,
                    hourVisible: lz(this.displayHours),
                    minMin: this.minMinutes,
                    minMax: lz(this.maxMinutes),
                    minStep: this.opts.minutesStep,
                    minValue: lz(this.minutes),
                    secMin: this.minSeconds,
                    secMax: lz(this.maxSeconds),
                    secStep: this.opts.secondsStep,
                    secValue: lz(this.seconds)
                },
                _template = dp.template(template, data);

            this.$timepicker = $(_template).appendTo(this.d.$datepicker);
            this.$ranges = $('[type="range"]', this.$timepicker);
            this.$hours = $('[name="hours"]', this.$timepicker);
            this.$minutes = $('[name="minutes"]', this.$timepicker);
            this.$seconds = $('[name="seconds"]', this.$timepicker);
            this.$hoursText = $('.datepicker--time-current-hours', this.$timepicker);
            this.$minutesText = $('.datepicker--time-current-minutes', this.$timepicker);
            this.$secondsText = $('.datepicker--time-current-seconds', this.$timepicker);

            if (this.d.ampm) {
                this.$ampm = $('<span class="datepicker--time-current-ampm">')
                    .appendTo($('.datepicker--time-current', this.$timepicker))
                    .html(this.dayPeriod);

                this.$timepicker.addClass('-am-pm-');
            }
        },

        _updateCurrentTime: function () {
            var h =  dp.getLeadingZeroNum(this.displayHours),
                m = dp.getLeadingZeroNum(this.minutes),
                s = dp.getLeadingZeroNum(this.seconds);

            this.$hoursText.html(h);
            this.$minutesText.html(m);
            this.$secondsText.html(s);

            if (this.d.ampm) {
                this.$ampm.html(this.dayPeriod);
            }
        },

        _updateRanges: function () {
            this.$hours.attr({
                min: this.minHours,
                max: this.maxHours
            }).val(this.hours);

            this.$minutes.attr({
                min: this.minMinutes,
                max: this.maxMinutes
            }).val(this.minutes);
            
            this.$seconds.attr({
                min: this.minSeconds,
                max: this.maxSeconds
            }).val(this.seconds);
        },

        /**
         * Sets minHours, minMinutes etc. from date. If date is not passed, than sets
         * values from options
         * @param [date] {object} - Date object, to get values from
         * @private
         */
        _handleDate: function (date) {
            this._setDefaultMinMaxTime();
            if (date) {
                if (dp.isSame(date, this.d.opts.minDate)) {
                    this._setMinTimeFromDate(this.d.opts.minDate);
                } else if (dp.isSame(date, this.d.opts.maxDate)) {
                    this._setMaxTimeFromDate(this.d.opts.maxDate);
                }
            }

            this._validateHoursMinutes(date);
        },

        update: function () {
            this._updateRanges();
            this._updateCurrentTime();
        },

        /**
         * Calculates valid hour value to display in text input and datepicker's body.
         * @param date {Date|Number} - date or hours
         * @param [ampm] {Boolean} - 12 hours mode
         * @returns {{hours: *, dayPeriod: string}}
         * @private
         */
        _getValidHoursFromDate: function (date, ampm) {
            var d = date,
                hours = date;

            if (date instanceof Date) {
                d = dp.getParsedDate(date);
                hours = d.hours;
            }

            var _ampm = ampm || this.d.ampm,
                dayPeriod = 'am';

            if (_ampm) {
                switch(true) {
                    case hours == 0:
                        hours = 12;
                        break;
                    case hours == 12:
                        dayPeriod = 'pm';
                        break;
                    case hours > 11:
                        hours = hours - 12;
                        dayPeriod = 'pm';
                        break;
                    default:
                        break;
                }
            }

            return {
                hours: hours,
                dayPeriod: dayPeriod
            }
        },

        set hours (val) {
            this._hours = val;

            var displayHours = this._getValidHoursFromDate(val);

            this.displayHours = displayHours.hours;
            this.dayPeriod = displayHours.dayPeriod;
        },

        get hours() {
            return this._hours;
        },

        //  Events
        // -------------------------------------------------

        _onChangeRange: function (e) {
            var $target = $(e.target),
                name = $target.attr('name');
            
            this.d.timepickerIsActive = true;

            this[name] = $target.val();
            this._updateCurrentTime();
            this.d._trigger('timeChange', [this.hours, this.minutes, this.seconds]);

            this._handleDate(this.d.lastSelectedDate);
            this.update()
        },

        _onSelectDate: function (e, data) {
            this._handleDate(data);
            this.update();
        },

        _onMouseEnterRange: function (e) {
            var name = $(e.target).attr('name');
            $('.datepicker--time-current-' + name, this.$timepicker).addClass('-focus-');
        },

        _onMouseOutRange: function (e) {
            var name = $(e.target).attr('name');
            if (this.d.inFocus) return; // Prevent removing focus when mouse out of range slider
            $('.datepicker--time-current-' + name, this.$timepicker).removeClass('-focus-');
        },

        _onMouseUpRange: function (e) {
            this.d.timepickerIsActive = false;
        }
    };
})();
 })(window, jQuery);