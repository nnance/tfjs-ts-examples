import {
    createModel,
    saveModel,
    trainModel,
} from '../models/recognize-handwriting'
import { MnistData } from '../client/MnistData'

async function train() {
    const model = createModel()
    const data = new MnistData()

    // Train the model
    await trainModel(model, data, 512, 5500, 1000)
    console.log('Done Training')
    const results = await saveModel(model)
    console.log(
        `Model saved as ${results.modelArtifactsInfo.modelTopologyType}`
    )
}

train()
