import { getData } from '../api/cars'
import {
    convertToTensor,
    createModel,
    saveModel,
    trainModel,
} from '../models/simple-number-prediction'

async function train() {
    const model = createModel()
    const data = await getData()

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(data)
    const { inputs, labels } = tensorData

    // Train the model
    await trainModel(model, inputs, labels)
    console.log('Done Training')
    const results = await saveModel(model)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}

train()
