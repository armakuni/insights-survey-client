const normalFormatter = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", timeZone: "UTC"});

export function toISOString(date) {

    if(date) {

        return new Date(date).toISOString();

    } else {

        return "";

    }

}

export function toDayTimeString(date) {

    if(date) {

        return normalFormatter.format(new Date(date));

    } else {

        return "";

    }

}
