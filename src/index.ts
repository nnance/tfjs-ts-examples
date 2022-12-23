import { getServer } from './server/app'
import { trainPrediction, trainHandwriting } from './server/train'

const port = 8080

type Commands = 'train' | 'serve'
type Models = 'recognize-handwriting' | 'predict'

type Argument = {
    name: string
    help: string
}

type Command = {
    name: Commands
    help: string
    args: Argument[]
}

type TrainOptions = {
    model: Models
    epochs: number
    batch_size: number
    model_save_path?: string
}

type ServeOptions = {
    model_load_path: string
}

const commands: Command[] = [
    {
        name: 'train',
        help: 'Train a model.',
        args: [
            {
                name: '--model',
                help: 'Model to be trained.',
            },
            {
                name: '--epochs',
                help: 'Number of epochs to be used to train the model.',
            },
            {
                name: '--batch_size',
                help: 'Batch size to be used during model training.',
            },
            {
                name: '--model_save_path',
                help: 'Path to which the model will be saved after training.',
            },
        ],
    },
    {
        name: 'serve',
        help: 'Serve a model.',
        args: [
            {
                name: '--model_load_path',
                help: 'Path from which the model will be loaded for serving.',
            },
        ],
    },
]

function displayHelp(command: Command) {
    console.log(command.help)
    console.log(`Usage: node index.js ${command.name} [options]`)
    console.log('')
    console.log('Options:')
    command.args.forEach((arg) => {
        console.log(`  ${arg.name}: ${arg.help}`)
    })
    console.log('')
}

function help() {
    console.log('')
    console.log('TensorFlow.js-Node Examples.')
    console.log('')
    console.log('Commands:')
    console.log('')
    commands.forEach(displayHelp)
}

function getCommand(command: Commands): Command {
    const cmd = commands.find((c) => c.name === command)
    if (cmd === undefined) {
        throw new Error(`Command ${command} not found.`)
    }
    return cmd
}

function parseTrainArgs(args: string[]) {
    const options: TrainOptions = {
        model: 'predict',
        epochs: 20,
        batch_size: 128,
    }

    args.forEach((arg) => {
        const [key, value] = arg.split('=')
        if (key === '--model') {
            options.model = value as Models
        } else if (key === '--epochs') {
            options.epochs = parseInt(value)
        } else if (key === '--batch_size') {
            options.batch_size = parseInt(value)
        } else if (key === '--model_save_path') {
            options.model_save_path = value
        }
    })
    return options
}

function parseServeArgs(args: string[]) {
    const options: Partial<ServeOptions> = {}
    args.forEach((arg) => {
        const [key, value] = arg.split('=')
        if (key === '--model_load_path') {
            options.model_load_path = value
        }
    })
    return options
}

try {
    const command = getCommand(process.argv[2] as Commands)
    if (command.name === 'train') {
        const args = parseTrainArgs(process.argv.slice(3))
        if (args.model === 'recognize-handwriting') {
            console.log('Training handwriting recognition model...')
            trainHandwriting(args.epochs, args.batch_size, args.model_save_path)
        } else if (args.model === 'predict') {
            console.log('Training prediction model...')
            trainPrediction(args.epochs, args.batch_size, args.model_save_path)
        } else {
            throw new Error(`Model ${args.model} not found.`)
        }
    } else if (command.name === 'serve') {
        const args = parseServeArgs(process.argv.slice(3))
        console.log('Serving model...')
        const app = getServer(args.model_load_path)
        app.listen(port)
    } else {
        throw new Error(`Command ${command.name} not found.`)
    }
} catch (error) {
    help()
    process.exit(0)
}
