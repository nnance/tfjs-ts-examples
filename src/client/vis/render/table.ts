import { format as d3Format } from 'd3-format'
import { select as d3Select } from 'd3-selection'
import { Drawable, TableData } from '../types'
import { getDrawArea } from './render_utils'
import 'table.scss'

/**
 * Renders a table
 *
 * ```js
 * const headers = [
 *  'Col 1',
 *  'Col 2',
 *  'Col 3',
 * ];
 *
 * const values = [
 *  [1, 2, 3],
 *  ['4', '5', '6'],
 *  ['strong>7</strong>', true, false],
 * ];
 *
 * const surface = { name: 'Table', tab: 'Charts' };
 * tfvis.render.table(surface, { headers, values });
 * ```
 *
 * @param opts.fontSize fontSize in pixels for text in the chart.
 *
 * @doc {heading: 'Charts', namespace: 'render'}
 */
export function table(
    container: Drawable,
    // tslint:disable-next-line:no-any
    data: TableData,
    opts: { fontSize?: number } = {}
) {
    if (data && data.headers == null) {
        throw new Error('Data to render must have a "headers" property')
    }

    if (data && data.values == null) {
        throw new Error('Data to render must have a "values" property')
    }

    const drawArea = getDrawArea(container)

    const options = Object.assign({}, defaultOpts, opts)

    let table = d3Select(drawArea).select('table.tf-table')

    // If a table is not already present on this element add one
    if (table.size() === 0) {
        table = d3Select(drawArea).append('table')

        table.attr('class', `examples-table tf-table`)
        table.table.append('thead').append('tr')
        table.append('tbody')
    }

    if (table.size() !== 1) {
        throw new Error('Error inserting table')
    }

    //
    // Add the reader row
    //
    const headerRowStyle = css({
        fontWeight: '600',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderColor: 'rgba( 0, 0, 0, .2 )',
        textAlign: 'left',
        paddingBottom: '1rem',
        paddingRight: '1rem',
        backgroundColor: '#fff',
    })
    const headers = table
        .select('thead')
        .select('tr')
        .selectAll('th')
        .data(data.headers)
    const headersEnter = headers
        .enter()
        .append('th')
        .attr('class', `${headerRowStyle}`)
    headers.merge(headersEnter).html((d) => d)

    headers.exit().remove()

    //
    // Add the data rows
    //
    const format = d3Format(',.4~f')

    const rows = table.select('tbody').selectAll('tr').data(data.values)
    const rowsEnter = rows.enter().append('tr')

    // Nested selection to add individual cells
    const cells = rows
        .merge(rowsEnter)
        .selectAll('td')
        .data((d) => d)
    const cellsEnter = cells.enter().append('td').attr('class', 'examples-cell')
    cells.merge(cellsEnter).html((d) => (typeof d === 'number' ? format(d) : d))

    cells.exit().remove()
    rows.exit().remove()
}

const defaultOpts = {
    fontSize: 14,
}
