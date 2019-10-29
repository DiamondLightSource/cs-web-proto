import propTypes from "prop-types";
import checkPropTypes from "check-prop-types";

export const ContainerFeaturesProps = {
  margin: propTypes.string,
  padding: propTypes.string
};

export const AbsoluteContainerProps = propTypes.exact({
  position: propTypes.oneOf(["absolute"]).isRequired,
  x: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  y: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  height: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  width: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  ...ContainerFeaturesProps
});

export const FlexibleContainerProps = propTypes.exact({
  position: propTypes.oneOf(["relative"]).isRequired,
  height: propTypes.oneOfType([propTypes.string, propTypes.number]),
  width: propTypes.oneOfType([propTypes.string, propTypes.number]),
  ...ContainerFeaturesProps
});

export const macroMapProps = propTypes.objectOf(propTypes.string);

export const widgetStylingProps = propTypes.exact({
  font: propTypes.string,
  fontSize: propTypes.oneOfType([propTypes.string, propTypes.number]),
  fontWeight: propTypes.oneOfType([propTypes.string, propTypes.number]),
  textAlign: propTypes.oneOf(["center", "left", "right", "justify"]),
  backgroundColor: propTypes.string
});

export const BaseWidgetProps = {
  containerStyling: propTypes.oneOfType([
    AbsoluteContainerProps,
    FlexibleContainerProps
  ]).isRequired,
  widgetStyling: widgetStylingProps,
  macroMap: macroMapProps,
  children: propTypes.node
};

export const PVWidgetProps = {
  pvName: propTypes.string.isRequired,
  wrappers: propTypes.shape({
    copywrapper: propTypes.bool,
    alarmborder: propTypes.bool
  }),
  ...BaseWidgetProps
};

export const run = () => {
  console.log(
    checkPropTypes(
      BaseWidgetProps,
      {
        containerStyling: {
          position: "relative",
          height: "5px",
          width: "5px"
        },
        widgetStyling: {},
        macroMap: {
          pv1: "pv1",
          pv2: "pv2"
        }
      },
      "prop types",
      "Widget Props Test"
    )
  );
};
