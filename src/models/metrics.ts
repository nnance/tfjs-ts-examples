import { maximum, Scalar, Tensor1D, tidy } from '@tensorflow/tfjs-core'
import { classNames } from './recognize-handwriting'

export async function perClassAccuracy(
    labels: Tensor1D,
    predictions: Tensor1D,
    numClasses?: number
): Promise<Array<{ accuracy: number; count: number }>> {
    if (labels.rank !== 1) throw 'labels must be a 1D tensor'
    if (predictions.rank !== 1) throw 'predictions must be a 1D tensor'
    if (labels.size !== predictions.size)
        throw 'labels and predictions must be the same length'

    if (numClasses == null) {
        numClasses = tidy(() => {
            return maximum(labels.max(), predictions.max()).dataSync()[0] + 1
        })
    }

    return Promise.all([labels.data(), predictions.data()]).then(
        ([labelsArray, predsArray]) => {
            // Per class total counts
            const counts: number[] = Array(numClasses).fill(0)
            // Per class accuracy
            const accuracy: number[] = Array(numClasses).fill(0)

            for (let i = 0; i < labelsArray.length; i++) {
                const label = labelsArray[i]
                const pred = predsArray[i]

                counts[label] += 1
                if (label === pred) {
                    accuracy[label] += 1
                }
            }

            const results: Array<{ accuracy: number; count: number }> = []
            for (let i = 0; i < counts.length; i++) {
                results.push({
                    count: counts[i],
                    accuracy: counts[i] === 0 ? 0 : accuracy[i] / counts[i],
                })
            }

            return results
        }
    )
}

export function printEvaluationResult(evalOutput: Scalar[]) {
    console.log(
        `\nEvaluation result:\n` +
            `  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; ` +
            `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}\n`
    )
}

export function printPerClassAccuracy(
    accuracy: Array<{ accuracy: number; count: number }>
) {
    console.log('Per-class accuracy:')
    accuracy.forEach((acc, i) => {
        console.log(
            `  ${classNames[i]}: ${acc.accuracy.toFixed(3)} ` +
                `(${acc.count} examples)`
        )
    })
    console.log('\n')
}
