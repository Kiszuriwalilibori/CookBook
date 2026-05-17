// utils/getAbsoluteCommentDate.ts

export function getAbsoluteCommentDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfDayBeforeYesterday = new Date(startOfToday);
    startOfDayBeforeYesterday.setDate(startOfDayBeforeYesterday.getDate() - 2);

    // poniedziałek jako początek tygodnia
    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - diff);

    const formattedDate = new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);

    const fullDate = `${formattedDate} roku`;

    if (date >= startOfToday) {
        return `Dziś, ${fullDate}`;
    }

    if (date >= startOfYesterday) {
        return `Wczoraj, ${fullDate}`;
    }

    if (date >= startOfDayBeforeYesterday) {
        return `Przedwczoraj, ${fullDate}`;
    }

    if (date >= startOfWeek) {
        return `W tym tygodniu, ${fullDate}`;
    }

    return fullDate;
}
