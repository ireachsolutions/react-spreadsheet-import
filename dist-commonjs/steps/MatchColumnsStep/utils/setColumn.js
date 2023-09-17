'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MatchColumnsStep = require('../MatchColumnsStep.js');
var uniqueEntries = require('./uniqueEntries.js');

const setColumn = (oldColumn, field, data) => {
    switch (field?.fieldType.type) {
        case "select":
            const uniqueData = uniqueEntries.uniqueEntries(data || [], oldColumn.index);
            const matchedOptions = uniqueData?.map(option => {
                const value = field.fieldType.options.find((o) => o.value == option.value || o.label == option.entry || o.value == option.entry)?.value;
                return value ? { ...option, value } : option;
            });
            const allMatched = matchedOptions.filter(o => o.value).length == uniqueData?.length;
            return {
                ...oldColumn,
                type: allMatched ? MatchColumnsStep.ColumnType.matchedSelectOptions : MatchColumnsStep.ColumnType.matchedSelect,
                value: field.key,
                matchedOptions: matchedOptions
            };
        case "checkbox":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matchedCheckbox, value: field.key, header: oldColumn.header };
        case "input":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matched, value: field.key, header: oldColumn.header };
        default:
            return { index: oldColumn.index, header: oldColumn.header, type: MatchColumnsStep.ColumnType.empty };
    }
};

exports.setColumn = setColumn;
