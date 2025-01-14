import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import MapContext from './map-context';
var propTypes = {
  captureScroll: PropTypes.bool,
  captureDrag: PropTypes.bool,
  captureClick: PropTypes.bool,
  captureDoubleClick: PropTypes.bool
};
var defaultProps = {
  captureScroll: false,
  captureDrag: true,
  captureClick: true,
  captureDoubleClick: true
};

var BaseControl = function (_PureComponent) {
  _inherits(BaseControl, _PureComponent);

  function BaseControl() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BaseControl);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BaseControl)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_context", {});

    _defineProperty(_assertThisInitialized(_this), "_events", null);

    _defineProperty(_assertThisInitialized(_this), "_containerRef", createRef());

    _defineProperty(_assertThisInitialized(_this), "_onScroll", function (evt) {
      if (_this.props.captureScroll) {
        evt.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onDragStart", function (evt) {
      if (_this.props.captureDrag) {
        evt.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onDblClick", function (evt) {
      if (_this.props.captureDoubleClick) {
        evt.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onClick", function (evt) {
      if (_this.props.captureClick) {
        evt.stopPropagation();
      }
    });

    return _this;
  }

  _createClass(BaseControl, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var ref = this._containerRef.current;

      if (!ref) {
        return;
      }

      var eventManager = this._context.eventManager;

      if (eventManager) {
        this._events = {
          wheel: this._onScroll,
          panstart: this._onDragStart,
          anyclick: this._onClick,
          click: this._onClick,
          dblclick: this._onDblClick
        };
        eventManager.on(this._events, ref);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var eventManager = this._context.eventManager;

      if (eventManager && this._events) {
        eventManager.off(this._events);
      }
    }
  }, {
    key: "_render",
    value: function _render() {
      throw new Error('_render() not implemented');
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(MapContext.Consumer, null, function (context) {
        _this2._context = context;
        return _this2._render();
      });
    }
  }]);

  return BaseControl;
}(PureComponent);

_defineProperty(BaseControl, "propTypes", propTypes);

_defineProperty(BaseControl, "defaultProps", defaultProps);

export { BaseControl as default };
//# sourceMappingURL=base-control.js.map