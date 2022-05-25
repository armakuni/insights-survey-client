export async function monitorStepFailure(world, scenarioContext, logs) {

    if (scenarioContext.result.status === "FAILED") {

        try {

            await world.screenshot();
            logs.push({
                level: "ERROR",
                when: new Date(),
                text: "The scenario failed. Body html was: " + await world.page.innerHTML("body")
            });

        } catch (err) {

            console.error(err);

        }

    }
}

export function renderBrowserMessages(logs) {
    let group = [];
    for (const x of logs) {

        if ("uri" in x) {

            render();
            group = [x];

        } else {

            group.push(x);

        }

    }
    render();

    function render() {

        if (group.length > 1) {

            const scenario = group.shift();
            console.warn(
                `

---- BROWSER MESSAGES ----

Scenario: ${scenario.name} (${scenario.uri})

${group.map(x => `[${x.level.toUpperCase()}] ${x.when?.toISOString()} ${x.text}`).join("\n")}

----

`
            );

        }

    }
}
