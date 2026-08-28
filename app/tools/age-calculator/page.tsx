"use client";

import { useEffect, useMemo, useState } from "react";

type AgeParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-IN").format(Math.max(0, Math.floor(n)));

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (date: Date) =>
  date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

function createDate(dateValue: string, timeValue: string) {
  if (!dateValue) return null;

  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);

  if (!year || !month || !day) return null;

  return new Date(
    year,
    month - 1,
    day,
    Number.isFinite(hour) ? hour : 0,
    Number.isFinite(minute) ? minute : 0,
    0,
    0
  );
}

function getAge(birth: Date, end: Date): AgeParts {
  if (end < birth) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  let years = end.getFullYear() - birth.getFullYear();
  let months = end.getMonth() - birth.getMonth();
  let days = end.getDate() - birth.getDate();
  let hours = end.getHours() - birth.getHours();
  let minutes = end.getMinutes() - birth.getMinutes();
  let seconds = end.getSeconds() - birth.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    const previousMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    );

    days += previousMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

function getNextBirthday(birth: Date, now: Date) {
  const month = birth.getMonth();
  const originalDay = birth.getDate();

  let year = now.getFullYear();

  const makeBirthday = (y: number) => {
    let day = originalDay;

    const leap =
      y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

    if (month === 1 && day === 29 && !leap) {
      day = 28;
    }

    return new Date(
      y,
      month,
      day,
      birth.getHours(),
      birth.getMinutes(),
      0,
      0
    );
  };

  let birthday = makeBirthday(year);

  if (birthday <= now) {
    year++;
    birthday = makeBirthday(year);
  }

  return birthday;
}

function getMilestoneDate(birth: Date, years: number) {
  const year = birth.getFullYear() + years;
  const month = birth.getMonth();

  let day = birth.getDate();

  const leap =
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  if (month === 1 && day === 29 && !leap) {
    day = 28;
  }

  return new Date(
    year,
    month,
    day,
    birth.getHours(),
    birth.getMinutes(),
    0,
    0
  );
}

export default function AgeCalculator() {
  const today = new Date();

  const defaultDOB = `${today.getFullYear() - 30}-${pad(
    today.getMonth() + 1
  )}-${pad(today.getDate())}`;

  const todayString = `${today.getFullYear()}-${pad(
    today.getMonth() + 1
  )}-${pad(today.getDate())}`;

  const [birthDate, setBirthDate] = useState(defaultDOB);
  const [birthTime, setBirthTime] = useState("00:00");

  const [now, setNow] = useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(todayString);

  const [selectedTime, setSelectedTime] =
    useState("12:00");

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const birth = useMemo(
    () => createDate(birthDate, birthTime),
    [birthDate, birthTime]
  );

  const validBirth =
    birth !== null && birth.getTime() <= now.getTime();

  const age = useMemo(() => {
    if (!birth || !validBirth) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return getAge(birth, now);
  }, [birth, now, validBirth]);

  const totalSeconds = useMemo(() => {
    if (!birth || !validBirth) return 0;

    return Math.floor(
      (now.getTime() - birth.getTime()) / 1000
    );
  }, [birth, now, validBirth]);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalDays = Math.floor(totalSeconds / 86400);
  const totalWeeks = Math.floor(totalDays / 7);

  const nextBirthday = useMemo(() => {
    if (!birth || !validBirth) return null;

    return getNextBirthday(birth, now);
  }, [birth, now, validBirth]);

  const birthdayCountdown = useMemo(() => {
    if (!nextBirthday) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const difference = Math.max(
      0,
      Math.floor(
        (nextBirthday.getTime() - now.getTime()) / 1000
      )
    );

    return {
      days: Math.floor(difference / 86400),
      hours: Math.floor((difference % 86400) / 3600),
      minutes: Math.floor((difference % 3600) / 60),
      seconds: difference % 60,
    };
  }, [nextBirthday, now]);

  const dayOfBirth = birth
    ? birth.toLocaleDateString("en-IN", {
        weekday: "long",
      })
    : "-";

  const selectedAge = useMemo(() => {
    if (!birth) return null;

    const selected = createDate(
      selectedDate,
      selectedTime
    );

    if (!selected || selected < birth) {
      return null;
    }

    return getAge(birth, selected);
  }, [birth, selectedDate, selectedTime]);

  const milestones = [18, 21, 25, 30, 40, 50, 60, 70, 80];

  const upcomingMilestones = useMemo(() => {
    if (!birth || !validBirth) return [];

    return milestones
      .map((years) => ({
        years,
        date: getMilestoneDate(birth, years),
      }))
      .filter((item) => item.date > now)
      .slice(0, 4);
  }, [birth, now, validBirth]);

  const resetCalculator = () => {
    setBirthDate("");
    setBirthTime("00:00");
    setSelectedDate(todayString);
    setSelectedTime("12:00");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!birth || !validBirth) return;

    const result = `Exact Age

${age.years} Years, ${age.months} Months, ${age.days} Days
${age.hours} Hours, ${age.minutes} Minutes, ${age.seconds} Seconds

Date of Birth: ${formatDateTime(birth)}
Day of Birth: ${dayOfBirth}

Total Weeks: ${formatNumber(totalWeeks)}
Total Days: ${formatNumber(totalDays)}
Total Hours: ${formatNumber(totalHours)}
Total Minutes: ${formatNumber(totalMinutes)}
Total Seconds: ${formatNumber(totalSeconds)}

Next Birthday: ${
      nextBirthday ? formatDateTime(nextBirthday) : "-"
    }`;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const printResult = () => {
    window.print();
  };

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}

        <header className="header">
          <div className="header-icon">🎂</div>

          <h1>Exact Age Calculator</h1>

          <p>
            Calculate your exact age in years, months, days,
            hours, minutes and seconds.
          </p>
        </header>

        {/* INPUT CARD */}

        <section className="card input-card">
          <div className="input-grid">

            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                value={birthDate}
                max={todayString}
                onChange={(e) =>
                  setBirthDate(e.target.value)
                }
              />

              <small>
                Enter your date of birth.
              </small>
            </div>

            <div>
              <label>Time of Birth</label>

              <input
                type="time"
                value={birthTime}
                onChange={(e) =>
                  setBirthTime(e.target.value)
                }
              />

              <small>
                Add time for a more accurate result.
              </small>
            </div>

          </div>

          {!validBirth && birthDate && (
            <div className="error">
              ⚠️ Birth date/time cannot be in the future.
            </div>
          )}

          <div className="buttons">

            <button
              className="btn secondary"
              onClick={resetCalculator}
            >
              ↻ Reset
            </button>

            <button
              className="btn dark"
              onClick={copyResult}
              disabled={!validBirth}
            >
              {copied ? "✓ Copied" : "📋 Copy Result"}
            </button>

            <button
              className="btn green"
              onClick={printResult}
            >
              🖨 Print
            </button>

          </div>
        </section>

        {/* EXACT AGE */}

        <section className="exact-age">

          <div className="exact-title">
            YOUR EXACT AGE
          </div>

          <div className="age-grid">

            <div className="age-item">
              <strong>{age.years}</strong>
              <span>Years</span>
            </div>

            <div className="age-item">
              <strong>{age.months}</strong>
              <span>Months</span>
            </div>

            <div className="age-item">
              <strong>{age.days}</strong>
              <span>Days</span>
            </div>

            <div className="age-item">
              <strong>{age.hours}</strong>
              <span>Hours</span>
            </div>

            <div className="age-item">
              <strong>{age.minutes}</strong>
              <span>Minutes</span>
            </div>

            <div className="age-item">
              <strong>{age.seconds}</strong>
              <span>Seconds</span>
            </div>

          </div>

          <div className="live-text">
            ● LIVE AGE • Updates every second
          </div>

        </section>

        {/* STAT CARDS */}

        <section className="stats">

          <div className="stat">
            <span>📅</span>
            <small>Total Days</small>
            <strong>
              {formatNumber(totalDays)}
            </strong>
          </div>

          <div className="stat">
            <span>⏰</span>
            <small>Total Hours</small>
            <strong>
              {formatNumber(totalHours)}
            </strong>
          </div>

          <div className="stat">
            <span>⌛</span>
            <small>Total Minutes</small>
            <strong>
              {formatNumber(totalMinutes)}
            </strong>
          </div>

          <div className="stat">
            <span>⏱️</span>
            <small>Total Seconds</small>
            <strong>
              {formatNumber(totalSeconds)}
            </strong>
          </div>

        </section>

        {/* TWO CARDS */}

        <section className="two-column">

          {/* BIRTHDAY */}

          <div className="card">

            <h2>🎉 Next Birthday</h2>

            {nextBirthday ? (
              <>
                <div className="birthday-date">
                  {formatDate(nextBirthday)}
                </div>

                <div className="countdown">

                  <div>
                    <strong>
                      {birthdayCountdown.days}
                    </strong>
                    <span>Days</span>
                  </div>

                  <div>
                    <strong>
                      {pad(birthdayCountdown.hours)}
                    </strong>
                    <span>Hours</span>
                  </div>

                  <div>
                    <strong>
                      {pad(birthdayCountdown.minutes)}
                    </strong>
                    <span>Minutes</span>
                  </div>

                  <div>
                    <strong>
                      {pad(birthdayCountdown.seconds)}
                    </strong>
                    <span>Seconds</span>
                  </div>

                </div>
              </>
            ) : (
              <p>Please enter a valid birth date.</p>
            )}

          </div>

          {/* BIRTH INFO */}

          <div className="card">

            <h2>📌 Birth Information</h2>

            <div className="info">
              <span>Date of Birth</span>
              <strong>
                {birth ? formatDate(birth) : "-"}
              </strong>
            </div>

            <div className="info">
              <span>Time of Birth</span>
              <strong>{birthTime || "-"}</strong>
            </div>

            <div className="info">
              <span>Day of Birth</span>
              <strong>{dayOfBirth}</strong>
            </div>

            <div className="info">
              <span>Current Date</span>
              <strong>
                {formatDate(now)}
              </strong>
            </div>

            <div className="info">
              <span>Current Time</span>
              <strong>
                {now.toLocaleTimeString("en-IN")}
              </strong>
            </div>

          </div>

        </section>

        {/* AGE ON ANY DATE */}

        <section className="card section-gap">

          <h2>📆 Calculate Age on Any Date</h2>

          <p className="description">
            Find out exactly how old you were or will be on
            any selected date.
          </p>

          <div className="input-grid">

            <div>
              <label>Select Date</label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
              />
            </div>

            <div>
              <label>Select Time</label>

              <input
                type="time"
                value={selectedTime}
                onChange={(e) =>
                  setSelectedTime(e.target.value)
                }
              />
            </div>

          </div>

          <div className="selected-result">

            {selectedAge ? (
              <>
                <small>
                  Your age on {selectedDate}
                </small>

                <strong>
                  {selectedAge.years} Years
                </strong>

                <p>
                  {selectedAge.months} Months •{" "}
                  {selectedAge.days} Days •{" "}
                  {selectedAge.hours} Hours •{" "}
                  {selectedAge.minutes} Minutes
                </p>
              </>
            ) : (
              <strong>
                Please select a valid date.
              </strong>
            )}

          </div>

        </section>

        {/* MILESTONES */}

        <section className="card section-gap">

          <h2>🚀 Upcoming Age Milestones</h2>

          <p className="description">
            Important age milestones based on your date
            of birth.
          </p>

          <div className="milestones">

            {upcomingMilestones.map((item) => (
              <div
                className="milestone"
                key={item.years}
              >
                <strong>{item.years}</strong>

                <span>Years Old</span>

                <small>
                  {formatDate(item.date)}
                </small>
              </div>
            ))}

          </div>

        </section>

        {/* LIFE IN NUMBERS */}

        <section className="card section-gap">

          <h2>📊 Your Life in Numbers</h2>

          <div className="life-grid">

            <div>
              <span>Total Weeks</span>
              <strong>
                {formatNumber(totalWeeks)}
              </strong>
            </div>

            <div>
              <span>Total Days</span>
              <strong>
                {formatNumber(totalDays)}
              </strong>
            </div>

            <div>
              <span>Total Hours</span>
              <strong>
                {formatNumber(totalHours)}
              </strong>
            </div>

            <div>
              <span>Total Minutes</span>
              <strong>
                {formatNumber(totalMinutes)}
              </strong>
            </div>

            <div>
              <span>Total Seconds</span>
              <strong>
                {formatNumber(totalSeconds)}
              </strong>
            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer>
          🔒 Your calculation is performed directly in
          your browser.
          <br />
          ToolVoraa • Exact Age Calculator
        </footer>

      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height: 100vh;
          padding: 40px 16px 70px;
          background:
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #eef4ff 50%,
              #f8fafc 100%
            );
          color: #0f172a;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .container {
          max-width: 1180px;
          margin: auto;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header-icon {
          font-size: 46px;
          margin-bottom: 5px;
        }

        .header h1 {
          margin: 0;
          font-size: 46px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .header p {
          color: #64748b;
          font-size: 17px;
          margin: 10px auto 0;
          max-width: 700px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 26px;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .input-card {
          margin-bottom: 24px;
        }

        .input-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        input {
          width: 100%;
          height: 52px;
          border: 1px solid #dbe3ef;
          border-radius: 12px;
          padding: 0 15px;
          font-size: 16px;
          outline: none;
          background: white;
        }

        input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-card small {
          display: block;
          color: #64748b;
          margin-top: 7px;
          font-size: 12px;
        }

        .error {
          margin-top: 18px;
          padding: 13px 15px;
          border-radius: 12px;
          color: #be123c;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          font-weight: 600;
        }

        .buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .btn {
          min-height: 46px;
          padding: 0 20px;
          border: 0;
          border-radius: 11px;
          font-weight: 700;
          cursor: pointer;
          font-size: 14px;
        }

        .secondary {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .dark {
          background: #111827;
          color: white;
        }

        .green {
          background: #16a34a;
          color: white;
        }

        .dark:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .exact-age {
          padding: 34px 24px;
          border-radius: 24px;
          color: white;
          text-align: center;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5 55%,
              #7c3aed
            );
          box-shadow:
            0 20px 50px rgba(37, 99, 235, 0.22);
          margin-bottom: 24px;
        }

        .exact-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .age-grid {
          display: grid;
          grid-template-columns:
            repeat(6, 1fr);
          gap: 12px;
          max-width: 900px;
          margin: 26px auto 0;
        }

        .age-item {
          padding: 18px 8px;
          border-radius: 16px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .age-item strong {
          display: block;
          font-size: 38px;
          font-weight: 800;
        }

        .age-item span {
          display: block;
          margin-top: 5px;
          font-size: 13px;
        }

        .live-text {
          margin-top: 22px;
          font-size: 13px;
          opacity: 0.9;
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 20px;
          box-shadow:
            0 8px 25px rgba(15,23,42,0.05);
        }

        .stat span {
          display: block;
          font-size: 25px;
          margin-bottom: 8px;
        }

        .stat small {
          display: block;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .stat strong {
          font-size: 21px;
        }

        .two-column {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .card h2 {
          margin: 0;
          font-size: 21px;
        }

        .birthday-date {
          margin-top: 18px;
          color: #2563eb;
          font-size: 26px;
          font-weight: 800;
        }

        .countdown {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .countdown div {
          padding: 13px 5px;
          border-radius: 12px;
          background: #eff6ff;
          text-align: center;
        }

        .countdown strong {
          display: block;
          color: #1d4ed8;
          font-size: 22px;
        }

        .countdown span {
          display: block;
          color: #64748b;
          font-size: 11px;
          margin-top: 4px;
        }

        .info {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 14px 0;
          border-bottom: 1px solid #eef2f7;
          font-size: 14px;
        }

        .info:last-child {
          border-bottom: 0;
        }

        .info span {
          color: #64748b;
        }

        .info strong {
          text-align: right;
        }

        .section-gap {
          margin-bottom: 24px;
        }

        .description {
          color: #64748b;
          font-size: 14px;
          margin-top: 7px;
        }

        .selected-result {
          margin-top: 22px;
          padding: 24px;
          border-radius: 16px;
          text-align: center;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f5f3ff
            );
          border: 1px solid #dbeafe;
        }

        .selected-result small {
          display: block;
          color: #64748b;
        }

        .selected-result strong {
          display: block;
          margin-top: 6px;
          color: #2563eb;
          font-size: 34px;
        }

        .selected-result p {
          margin-bottom: 0;
          color: #475569;
        }

        .milestones {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 14px;
          margin-top: 20px;
        }

        .milestone {
          padding: 17px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          text-align: center;
        }

        .milestone strong {
          display: block;
          color: #2563eb;
          font-size: 28px;
        }

        .milestone span {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }

        .milestone small {
          display: block;
          color: #64748b;
          margin-top: 8px;
        }

        .life-grid {
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .life-grid div {
          padding: 16px;
          border-radius: 13px;
          background: #f8fafc;
          text-align: center;
        }

        .life-grid span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .life-grid strong {
          font-size: 19px;
          word-break: break-word;
        }

        footer {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          margin-top: 28px;
        }

        @media (max-width: 900px) {
          .age-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .milestones {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .life-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .page {
            padding: 25px 12px 50px;
          }

          .header h1 {
            font-size: 34px;
          }

          .input-grid,
          .two-column {
            grid-template-columns: 1fr;
          }

          .age-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .age-item strong {
            font-size: 28px;
          }

          .countdown {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .card {
            padding: 20px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .stat {
            padding: 14px;
          }

          .stat strong {
            font-size: 16px;
          }

          .age-item {
            padding: 12px 4px;
          }

          .age-item strong {
            font-size: 22px;
          }

          .age-item span {
            font-size: 10px;
          }

          .milestones,
          .life-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .selected-result strong {
            font-size: 27px;
          }

          .buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }

        @media print {
          .buttons,
          .input-card,
          .selected-result {
            display: none !important;
          }

          .page {
            background: white !important;
            padding: 0 !important;
          }

          .card,
          .stat {
            box-shadow: none !important;
          }

          .exact-age {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}