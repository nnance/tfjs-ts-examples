export type Car = {
    Name: string
    Miles_per_Gallon: number
    Cylinders: number
    Displacement: number
    Horsepower: number
    Weight_in_lbs: number
    Acceleration: number
    Year: string
    Origin: string
}

export type CarPerformance = {
    mpg: number
    horsepower: number
}

export async function getData(): Promise<CarPerformance[]> {
    const carsDataResponse = await fetch(
        'https://storage.googleapis.com/tfjs-tutorials/carsData.json'
    )
    const carsData: Car[] = await carsDataResponse.json()
    const cleaned = carsData
        .map((car) => ({
            mpg: car.Miles_per_Gallon,
            horsepower: car.Horsepower,
        }))
        .filter((car) => car.mpg != null && car.horsepower != null)

    return cleaned
}
