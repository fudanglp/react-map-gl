import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { normalizeStyle } from '../utils/style-utils';
import WebMercatorViewport from 'viewport-mercator-project';
import AutoSizer from 'react-virtualized-auto-sizer';
import Mapbox from '../mapbox/mapbox';
import mapboxgl from '../utils/mapboxgl';
import { checkVisibilityConstraints } from '../utils/map-constraints';
import { MAPBOX_LIMITS } from '../utils/map-state';
import MapContext from './map-context';
var TOKEN_DOC_URL = 'https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens';
var NO_TOKEN_WARNING = 'A valid API access token is required to use Mapbox data';

function noop() {}

var UNAUTHORIZED_ERROR_CODE = 401;
var CONTAINER_STYLE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};
var propTypes = Object.assign({}, Mapbox.propTypes, {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onResize: PropTypes.func,
  preventStyleDiffing: PropTypes.bool,
  disableTokenWarning: PropTypes.bool,
  visible: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  visibilityConstraints: PropTypes.object
});
var defaultProps = Object.assign({}, Mapbox.defaultProps, {
  preventStyleDiffing: false,
  disableTokenWarning: false,
  visible: true,
  onResize: noop,
  className: '',
  style: null,
  visibilityConstraints: MAPBOX_LIMITS
});
export default class StaticMap extends PureComponent {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "state", {
      accessTokenInvalid: false
    });

    _defineProperty(this, "_mapbox", null);

    _defineProperty(this, "_map", null);

    _defineProperty(this, "_mapboxMapRef", createRef());

    _defineProperty(this, "_mapContainerRef", createRef());

    _defineProperty(this, "_queryParams", {});

    _defineProperty(this, "_width", 0);

    _defineProperty(this, "_height", 0);

    _defineProperty(this, "getMap", () => {
      return this._map;
    });

    _defineProperty(this, "queryRenderedFeatures", function (geometry) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this._map.queryRenderedFeatures(geometry, options);
    });

    _defineProperty(this, "_mapboxMapError", evt => {
      var statusCode = evt.error && evt.error.status || evt.status;

      if (statusCode === UNAUTHORIZED_ERROR_CODE && !this.state.accessTokenInvalid) {
        console.error(NO_TOKEN_WARNING);
        this.setState({
          accessTokenInvalid: true
        });
      }

      this.props.onError(evt);
    });
  }

  static supported() {
    return mapboxgl && mapboxgl.supported();
  }

  componentDidMount() {
    if (!StaticMap.supported()) {}

    var {
      mapStyle
    } = this.props;
    this._mapbox = new Mapbox(Object.assign({}, this.props, {
      width: this._width,
      height: this._height,
      container: this._mapboxMapRef.current,
      onError: this._mapboxMapError,
      mapStyle: normalizeStyle(mapStyle)
    }));
    this._map = this._mapbox.getMap();
  }

  componentDidUpdate(prevProps) {
    if (this._mapbox) {
      this._updateMapStyle(prevProps, this.props);

      this._updateMapProps(this.props);
    }
  }

  componentWillUnmount() {
    if (this._mapbox) {
      this._mapbox.finalize();

      this._mapbox = null;
      this._map = null;
    }
  }

  _updateMapSize(width, height) {
    if (this._width !== width || this._height !== height) {
      this._width = width;
      this._height = height;

      this._updateMapProps(this.props);
    }
  }

  _updateMapStyle(oldProps, newProps) {
    var mapStyle = newProps.mapStyle;
    var oldMapStyle = oldProps.mapStyle;

    if (mapStyle !== oldMapStyle) {
      this._map.setStyle(normalizeStyle(mapStyle), {
        diff: !this.props.preventStyleDiffing
      });
    }
  }

  _updateMapProps(props) {
    if (!this._mapbox) {
      return;
    }

    this._mapbox.setProps(Object.assign({}, props, {
      width: this._width,
      height: this._height
    }));
  }

  _renderNoTokenWarning() {
    if (this.state.accessTokenInvalid && !this.props.disableTokenWarning) {
      var style = {
        position: 'absolute',
        left: 0,
        top: 0
      };
      return React.createElement("div", {
        key: "warning",
        id: "no-token-warning",
        style: style
      }, React.createElement("h3", {
        key: "header"
      }, "NO_TOKEN_WARNING"), React.createElement("div", {
        key: "text"
      }, "For information on setting up your basemap, read"), React.createElement("a", {
        key: "link",
        href: TOKEN_DOC_URL
      }, "Note on Map Tokens"));
    }

    return null;
  }

  _renderOverlays(dimensions) {
    var {
      width = Number(this.props.width),
      height = Number(this.props.height)
    } = dimensions;

    this._updateMapSize(width, height);

    return React.createElement(MapContext.Consumer, null, interactiveContext => {
      var context = _objectSpread({}, interactiveContext, {
        viewport: new WebMercatorViewport(_objectSpread({}, this.props, {}, this.props.viewState, {
          width,
          height
        })),
        map: this._map,
        mapContainer: interactiveContext.mapContainer || this._mapContainerRef.current
      });

      return React.createElement(MapContext.Provider, {
        value: context
      }, React.createElement("div", {
        key: "map-overlays",
        className: "overlays",
        style: CONTAINER_STYLE
      }, this.props.children));
    });
  }

  render() {
    var {
      className,
      width,
      height,
      style,
      visibilityConstraints
    } = this.props;
    var mapContainerStyle = Object.assign({
      position: 'relative'
    }, style, {
      width,
      height
    });
    var visible = this.props.visible && checkVisibilityConstraints(this.props.viewState || this.props, visibilityConstraints);
    var mapStyle = Object.assign({}, CONTAINER_STYLE, {
      visibility: visible ? 'inherit' : 'hidden'
    });
    return React.createElement("div", {
      key: "map-container",
      style: mapContainerStyle,
      ref: this._mapContainerRef
    }, React.createElement("div", {
      key: "map-mapbox",
      ref: this._mapboxMapRef,
      style: mapStyle,
      className: className
    }), React.createElement(AutoSizer, {
      key: "autosizer",
      disableWidth: Number.isFinite(width),
      disableHeight: Number.isFinite(height),
      onResize: this.props.onResize
    }, this._renderOverlays.bind(this)), this._renderNoTokenWarning());
  }

}

_defineProperty(StaticMap, "propTypes", propTypes);

_defineProperty(StaticMap, "defaultProps", defaultProps);
//# sourceMappingURL=static-map.js.map