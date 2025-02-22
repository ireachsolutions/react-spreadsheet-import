'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react$1 = require('react');
var react = require('@chakra-ui/react');
var UserTableColumn = require('./components/UserTableColumn.js');
var useRsi = require('../../hooks/useRsi.js');
var TemplateColumn = require('./components/TemplateColumn.js');
var ColumnGrid = require('./components/ColumnGrid.js');
var setColumn = require('./utils/setColumn.js');
var setIgnoreColumn = require('./utils/setIgnoreColumn.js');
var setSubColumn = require('./utils/setSubColumn.js');
var normalizeTableData = require('./utils/normalizeTableData.js');
var getMatchedColumns = require('./utils/getMatchedColumns.js');
var UnmatchedFieldsAlert = require('../../components/Alerts/UnmatchedFieldsAlert.js');
var findUnmatchedRequiredFields = require('./utils/findUnmatchedRequiredFields.js');

exports.ColumnType = void 0;
(function (ColumnType) {
    ColumnType[ColumnType["empty"] = 0] = "empty";
    ColumnType[ColumnType["ignored"] = 1] = "ignored";
    ColumnType[ColumnType["matched"] = 2] = "matched";
    ColumnType[ColumnType["matchedCheckbox"] = 3] = "matchedCheckbox";
    ColumnType[ColumnType["matchedSelect"] = 4] = "matchedSelect";
    ColumnType[ColumnType["matchedSelectOptions"] = 5] = "matchedSelectOptions";
})(exports.ColumnType || (exports.ColumnType = {}));
const MatchColumnsStep = ({ data, headerValues, onContinue }) => {
    const toast = react.useToast();
    const dataExample = data.slice(0, 2);
    const { fields, autoMapHeaders, autoMapDistance, translations } = useRsi.useRsi();
    const [isLoading, setIsLoading] = react$1.useState(false);
    const [columns, setColumns] = react$1.useState(
    // Do not remove spread, it indexes empty array elements, otherwise map() skips over them
    [...headerValues].map((value, index) => ({ type: exports.ColumnType.empty, index, header: value ?? "" })));
    const [showUnmatchedFieldsAlert, setShowUnmatchedFieldsAlert] = react$1.useState(false);
    const onChange = react$1.useCallback((value, columnIndex) => {
        const field = fields.find((field) => field.key === value);
        const existingFieldIndex = columns.findIndex((column) => "value" in column && column.value === field.key);
        setColumns(columns.map((column, index) => {
            columnIndex === index ? setColumn.setColumn(column, field, data) : column;
            if (columnIndex === index) {
                return setColumn.setColumn(column, field, data);
            }
            else if (index === existingFieldIndex) {
                toast({
                    status: "warning",
                    variant: "left-accent",
                    position: "bottom-left",
                    title: translations.matchColumnsStep.duplicateColumnWarningTitle,
                    description: translations.matchColumnsStep.duplicateColumnWarningDescription,
                    isClosable: true,
                });
                return setColumn.setColumn(column);
            }
            else {
                return column;
            }
        }));
    }, [
        columns,
        data,
        fields,
        toast,
        translations.matchColumnsStep.duplicateColumnWarningDescription,
        translations.matchColumnsStep.duplicateColumnWarningTitle,
    ]);
    const onIgnore = react$1.useCallback((columnIndex) => {
        setColumns(columns.map((column, index) => (columnIndex === index ? setIgnoreColumn.setIgnoreColumn(column) : column)));
    }, [columns, setColumns]);
    const onRevertIgnore = react$1.useCallback((columnIndex) => {
        setColumns(columns.map((column, index) => (columnIndex === index ? setColumn.setColumn(column) : column)));
    }, [columns, setColumns]);
    const onSubChange = react$1.useCallback((value, columnIndex, entry) => {
        setColumns(columns.map((column, index) => columnIndex === index && "matchedOptions" in column ? setSubColumn.setSubColumn(column, entry, value) : column));
    }, [columns, setColumns]);
    const unmatchedRequiredFields = react$1.useMemo(() => findUnmatchedRequiredFields.findUnmatchedRequiredFields(fields, columns), [fields, columns]);
    const handleOnContinue = react$1.useCallback(async () => {
        if (unmatchedRequiredFields.length > 0) {
            setShowUnmatchedFieldsAlert(true);
        }
        else {
            setIsLoading(true);
            await onContinue(normalizeTableData.normalizeTableData(columns, data, fields), data, columns);
            setIsLoading(false);
        }
    }, [unmatchedRequiredFields.length, onContinue, columns, data, fields]);
    const handleAlertOnContinue = react$1.useCallback(async () => {
        setShowUnmatchedFieldsAlert(false);
        setIsLoading(true);
        await onContinue(normalizeTableData.normalizeTableData(columns, data, fields), data, columns);
        setIsLoading(false);
    }, [onContinue, columns, data, fields]);
    react$1.useEffect(() => {
        if (autoMapHeaders) {
            setColumns(getMatchedColumns.getMatchedColumns(columns, fields, data, autoMapDistance));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(UnmatchedFieldsAlert.UnmatchedFieldsAlert, { isOpen: showUnmatchedFieldsAlert, onClose: () => setShowUnmatchedFieldsAlert(false), fields: unmatchedRequiredFields, onConfirm: handleAlertOnContinue }), jsxRuntime.jsx(ColumnGrid.ColumnGrid, { columns: columns, onContinue: handleOnContinue, isLoading: isLoading, userColumn: (column) => (jsxRuntime.jsx(UserTableColumn.UserTableColumn, { column: column, onIgnore: onIgnore, onRevertIgnore: onRevertIgnore, entries: dataExample.map((row) => row[column.index]) })), templateColumn: (column) => jsxRuntime.jsx(TemplateColumn.TemplateColumn, { column: column, onChange: onChange, onSubChange: onSubChange }) })] }));
};

exports.MatchColumnsStep = MatchColumnsStep;
