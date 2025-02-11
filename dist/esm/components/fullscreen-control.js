import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { document } from '../utils/globals';
import PropTypes from 'prop-types';
import BaseControl from './base-control';
import React from 'react';
import mapboxgl from '../utils/mapboxgl';
var propTypes = Object.assign({}, BaseControl.propTypes, {
  className: PropTypes.string,
  container: PropTypes.object
});
var defaultProps = Object.assign({}, BaseControl.defaultProps, {
  className: '',
  container: null
});

var FullscreenControl = function (_BaseControl) {
  _inherits(FullscreenControl, _BaseControl);

  function FullscreenControl() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FullscreenControl);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FullscreenControl)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isFullscreen: false,
      showButton: false
    });

    _defineProperty(_assertThisInitialized(_this), "_mapboxFullscreenControl", null);

    _defineProperty(_assertThisInitialized(_this), "_onFullscreenChange", function () {
      var nextState = !_this._mapboxFullscreenControl._fullscreen;
      _this._mapboxFullscreenControl._fullscreen = nextState;

      _this.setState({
        isFullscreen: nextState
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onClickFullscreen", function () {
      _this._mapboxFullscreenControl._onClickFullscreen();
    });

    return _this;
  }

  _createClass(FullscreenControl, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var container = this.props.container || this._context.mapContainer;
      this._mapboxFullscreenControl = new mapboxgl.FullscreenControl({
        container: container
      });
      this.setState({
        showButton: this._mapboxFullscreenControl._checkFullscreenSupport()
      });
      document.addEventListener(this._mapboxFullscreenControl._fullscreenchange, this._onFullscreenChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener(this._mapboxFullscreenControl._fullscreenchange, this._onFullscreenChange);
    }
  }, {
    key: "_renderButton",
    value: function _renderButton(type, label, callback) {
      return React.createElement("button", {
        key: type,
        className: "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(type),
        type: "button",
        title: label,
        onClick: callback
      });
    }
  }, {
    key: "_render",
    value: function _render() {
      if (!this.state.showButton) {
        return null;
      }

      var className = this.props.className;
      var isFullscreen = this.state.isFullscreen;
      var type = isFullscreen ? 'shrink' : 'fullscreen';
      return React.createElement("div", {
        className: "mapboxgl-ctrl mapboxgl-ctrl-group ".concat(className),
        ref: this._containerRef
      }, this._renderButton(type, 'Toggle fullscreen', this._onClickFullscreen));
    }
  }]);

  return FullscreenControl;
}(BaseControl);

_defineProperty(FullscreenControl, "propTypes", propTypes);

_defineProperty(FullscreenControl, "defaultProps", defaultProps);

export { FullscreenControl as default };
//# sourceMappingURL=fullscreen-control.js.map