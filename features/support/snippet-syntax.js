export default function() {

    return {

        build: function({ comment, functionName, generatedExpressions, stepParameterNames }) {

            const generatedExpression = generatedExpressions[0];
            let { expressionTemplate, parameterTypes } = generatedExpression;
            const functionParameters = [];
            for(let i = 0; i < parameterTypes.length; i++) {
                expressionTemplate = expressionTemplate.replace(`{${i}}`, parameterTypes[i].name)
                functionParameters.push(`${parameterTypes[i].name}_${i}`);
            }

            functionParameters.push(...stepParameterNames);
            return [
                `${functionName}("${expressionTemplate}", async function(${functionParameters.join(", ")}) {`,
                `    return "pending";`,
                `});`
            ].join("\n");

        }

    };

}
