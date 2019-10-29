import propTypes from "prop-types";
import checkPropTypes from "check-prop-types";

export const ContainerFeaturesProps = {
  margin: propTypes.string,
  padding: propTypes.string
};

export const AbsoluteContainerProps = {
  position: propTypes.oneOf(["absolute"]).isRequired,
  x: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  y: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  height: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  width: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  ...ContainerFeaturesProps
};

export const FlexibleContainerProps = {
  position: propTypes.oneOf(["relative"]).isRequired,
  height: propTypes.oneOfType([propTypes.string, propTypes.number]),
  width: propTypes.oneOfType([propTypes.string, propTypes.number]),
  ...ContainerFeaturesProps
};

export const MacroMapProps = {
  macroMap: propTypes.objectOf(propTypes.string.isRequired)
};
export const RequiredMacroMapProps = {
  macroMap: propTypes.objectOf(propTypes.string.isRequired)
};

export const WidgetStylingProps = {
  font: propTypes.string,
  fontSize: propTypes.oneOfType([propTypes.string, propTypes.number]),
  fontWeight: propTypes.oneOfType([propTypes.string, propTypes.number]),
  textAlign: propTypes.oneOf(["center", "left", "right", "justify"]),
  backgroundColor: propTypes.string
};

export const BaseWidgetProps = {
  containerStyling: propTypes.oneOfType([
    propTypes.exact(AbsoluteContainerProps),
    propTypes.exact(FlexibleContainerProps)
  ]).isRequired,
  widgetStyling: propTypes.exact(WidgetStylingProps),
  children: propTypes.node,
  ...MacroMapProps
};

export const PVWidgetExtraProps = {
  pvName: propTypes.string.isRequired,
  wrappers: propTypes.shape({
    copywrapper: propTypes.bool,
    alarmborder: propTypes.bool
  })
};

export const PVWidgetProperties = {
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
