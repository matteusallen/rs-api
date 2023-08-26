import xlsxPopulate from 'xlsx-populate';
import { REPORT_MERGED_COLUMN_NAMES, REPORT_AMOUNT_FORMATTED_COLUMNS, REPORT_SPECIAL_HEADERS, REPORT_COLUMNS } from 'Constants';

export const getTwoItemsRow = (length, firstColumnText, lastColumnText) => {
  const row = [];

  for (let i = 0; i < length; i++) {
    row.push('blank');
  }

  if (typeof firstColumnText == 'string' || (typeof lastColumnText == 'number' && firstColumnText !== null)) {
    row[0] = firstColumnText;
  }

  if (lastColumnText || (typeof lastColumnText == 'number' && lastColumnText !== null)) {
    row[length] = lastColumnText;
  }

  return row;
};

export const populateTemplate = async (
  reportDataArray,
  templatePath,
  templateSheetName,
  startCol,
  startRow,
  isFirstRowHeader,
  outputFormat,
  reportsLimit = 5
) => {
  try {
    if (reportDataArray && reportDataArray.length > reportsLimit) {
      throw new Error(`You cannot export more than ${reportsLimit} reports at a time`);
    }

    const columns = REPORT_COLUMNS;

    // Load an existing workbook
    const workbook = await xlsxPopulate.fromFileAsync(templatePath);

    //load template sheet
    const templateSheet = workbook.sheet(templateSheetName);

    for (let i = 0; i < reportDataArray.length; i++) {
      const { data, sheetName, headerLabels, title, subTitle, sheetTitle, titleCell } = reportDataArray[i];

      //only using first 29 char because excel has 31 char limit for sheet name
      //appending i to avoid sheet with same substring values
      const newSheetName = `${String(sheetName)
        .substring(0, 29)
        .trim()
        .replace(/[[\]\\/*:]/g, '-')}_${i + 1}`;

      //clone sheets to use from sheet template into the workbook
      workbook.cloneSheet(templateSheet, newSheetName);

      if (i === 0) workbook.sheet(newSheetName).active(true);

      //pull in sheet to use
      const reportSheet = workbook.sheet(newSheetName);
      const totalsRangeStart = columns[startCol] + startRow;
      const totalsRangeEnd = columns[startCol + data[0].length - 1] + (startRow + data.length - 1);
      const headersRangeStart = columns[startCol] + (startRow - 1);
      const headersRangeEnd = columns[startCol + headerLabels[0].length - 1] + (startRow - 1);
      const totalsRange = reportSheet.range(`${totalsRangeStart}:${totalsRangeEnd}`);
      const headersRange = reportSheet.range(`${headersRangeStart}:${headersRangeEnd}`);

      headersRange.value(headerLabels).style({
        bold: isFirstRowHeader ? true : false,
        border: isFirstRowHeader
          ? {
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              bottom: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              right: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          : {},
        horizontalAlignment: 'center',
        fontSize: 10,
        fontFamily: 'Roboto',
        fontColor: '434343'
      });

      totalsRange.value(data);

      totalsRange.style({
        verticalAlignment: 'center',
        wrapText: true,
        fontColor: 'FF666666',
        border: {
          top: false,
          bottom: false,
          left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
        }
      });

      const columnNumbersToMerge = [],
        columnNumbersWithAmountFormat = [],
        divider = [],
        groupDivider = [],
        dividerTop = [],
        allGreyBackgroundRow = [],
        totalsRow = [];
      let grandTotalColumn;

      if (templatePath.indexOf('transaction-report') > 0) {
        headersRange.forEach(cell => {
          if (REPORT_AMOUNT_FORMATTED_COLUMNS.includes(cell.value())) {
            columnNumbersWithAmountFormat.push(cell.columnNumber());
          }
        });
      }

      totalsRange.map((cell, index) => {
        if (index % 2 != 0) cell.style({ fill: 'F2F2F2' });
        if (cell.columnNumber() > 2 && cell.columnNumber() < 9) cell.style({ horizontalAlignment: 'center' });
        if (cell.columnNumber() > 8) cell.style({ horizontalAlignment: 'right' });

        if (index < 1 && !isFirstRowHeader) {
          //first row is dates and second is header
          cell.style({
            bold: true,
            fontSize: 10,
            fontColor: 'FF434343',
            fontFamily: 'Roboto',
            verticalAlignment: 'bottom',
            border: {
              left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              right: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (REPORT_MERGED_COLUMN_NAMES.includes(cell.value())) {
          columnNumbersToMerge.push(cell.columnNumber());
        }
        if (REPORT_AMOUNT_FORMATTED_COLUMNS.includes(cell.value())) {
          columnNumbersWithAmountFormat.push(cell.columnNumber());
        }

        if (cell.value() === 'divider') {
          divider.push(index);
          cell.clear();
        }

        if (cell.value() === 'group-divider') {
          groupDivider.push(index);
          cell.clear();
        }

        if (cell.value() === 'divider-top') {
          dividerTop.push(index);
          cell.clear();
        }

        if (cell.value() === 'Grand Total') {
          allGreyBackgroundRow.push(index);
          grandTotalColumn = cell.columnNumber();
        }

        if (cell.value() === 'totalsRow') {
          totalsRow.push(index);
          cell.clear();
        }
      });

      totalsRange.map((cell, index) => {
        if (columnNumbersToMerge.includes(cell.columnNumber())) {
          if (REPORT_MERGED_COLUMN_NAMES.includes(cell.value())) {
            cell.style({
              rightBorder: false,
              leftBorder: false,
              bottomBorder: false,
              topBorder: true,
              horizontalAlignment: 'right',
              border: {
                top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
              }
            });
          } else {
            cell.style({
              horizontalAlignment: 'right'
            });
          }
        }

        if (!isNaN(cell.value()) && columnNumbersWithAmountFormat.includes(cell.columnNumber()) && (divider.length ? index < divider[0] : true)) {
          //added divider here so no need to format numbers after the first divider
          //may need to update later based on the report
          cell.style({
            // numberFormat: '$#,##0.00;[Red]($#,##0.00)' // "Currency" format with red negative amounts, as opposed to "Accounting" format
            // numberFormat: '_($* #,##0.00_);[Red]_($* (#,##0.00);_($* " -"??_);_(@_)' // "Accounting" format with red negative amounts
            numberFormat: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)' // "Accounting" format
          });
        }

        if (data[0].length + 1 === cell.columnNumber() && index < 1) {
          cell.style({
            border: {
              right: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (data[data.length - 1].length + 1 === cell.columnNumber() && cell.value() === 'Total products sold') {
          cell.style({
            border: {
              right: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              left: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (cell.value() === 'blank') {
          cell.clear();
          cell.style({
            border: {}
          });

          if (startCol + 1 === cell.columnNumber()) {
            cell.style({
              border: {
                left: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
              }
            });
          }
        }

        if (allGreyBackgroundRow.includes(index)) {
          cell.style({
            fill: 'F2F2F2',
            border: {
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });

          if (startCol + 1 === cell.columnNumber()) {
            cell.style({
              border: {
                left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
                top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
              }
            });
          }
        }

        if (totalsRow.includes(index)) {
          cell.style({
            fill: 'F2F2F2',
            border: {
              bottom: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            },
            numberFormat: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)' // "Accounting" format
          });

          if (startCol + 1 === cell.columnNumber()) {
            cell.style({
              border: {
                left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
                bottom: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
              }
            });
          }
        }

        if (cell.columnNumber() === grandTotalColumn && cell.value() === 'Grand Total') {
          cell.style({
            border: {
              left: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              right: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (divider.includes(index) || groupDivider.includes(index)) {
          cell.style({
            fill: 'FFFFFF',
            border: {
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } },
              bottom: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (dividerTop.includes(index)) {
          cell.style({
            fill: 'FFFFFF',
            border: {
              top: { style: 'thin', color: { rgb: 'FFD9D9D9' } }
            }
          });
        }

        if (REPORT_SPECIAL_HEADERS.includes(cell.value())) {
          cell.style({
            bold: true,
            fontSize: 10,
            fontColor: '666666',
            fontFamily: 'Roboto',
            verticalAlignment: 'bottom',
            rightBorder: cell.columnNumber() === data[0].length + 1 ? true : false,
            leftBorder: cell.columnNumber() === startCol + 1 ? true : false
          });
        }
      });

      for (let i = startRow; i < startRow + data.length; i++) {
        reportSheet.row(i).height(24.75);
      }

      for (const columnNumber of columnNumbersToMerge) {
        reportSheet.column(columnNumber).width(12.67);
      }

      for (const index of allGreyBackgroundRow) {
        reportSheet.row(startRow + index).style('wrapText', false);
      }

      sheetTitle && reportSheet.cell('B5').value(sheetTitle);
      reportSheet.cell(titleCell ?? 'B6').value(title);
      reportSheet.cell('B7').value(subTitle);
      reportSheet
        .cell('B7')
        .style({ bold: false, fontSize: 9, fontFamily: 'Roboto', fontColor: '434343', verticalAlignment: 'top', horizontalAlignment: 'left' });
    }

    //delete sheet template from workbook
    workbook.deleteSheet(templateSheetName);

    return workbook.outputAsync(outputFormat);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};
