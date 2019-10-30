import PropTypes from "prop-types";
import checkPropTypes from "check-prop-types";

export const ContainerFeaturesProps = {
  margin: PropTypes.string,
  padding: PropTypes.string
};

export const AbsoluteContainerProps = {
  position: PropTypes.oneOf(["absolute"]).isRequired,
  x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ...ContainerFeaturesProps
};

export const FlexibleContainerProps = {
  position: PropTypes.oneOf(["relative"]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ...ContainerFeaturesProps
};

export const MacroMapProps = {
  macroMap: PropTypes.objectOf(PropTypes.string.isRequired)
};
export const RequiredMacroMapProps = {
  macroMap: PropTypes.objectOf(PropTypes.string.isRequired)
};

export const WidgetStylingProps = {
  font: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textAlign: PropTypes.oneOf(["center", "left", "right", "justify"]),
  backgroundColor: PropTypes.string
};

export const AbsoluteComponent = {
  containerStyling: PropTypes.shape(AbsoluteContainerProps).isRequired,
  widgetStyling: PropTypes.shape(WidgetStylingProps),
  macroMap: PropTypes.objectOf(PropTypes.string)
};

export const FlexibleComponent = {
  containerStyling: PropTypes.shape(FlexibleContainerProps).isRequired,
  widgetStyling: PropTypes.shape(WidgetStylingProps),
  macroMap: PropTypes.objectOf(PropTypes.string)
};

export const BaseWidgetProps = {
  containerStyling: PropTypes.oneOfType([
    PropTypes.shape(AbsoluteContainerProps),
    PropTypes.shape(FlexibleContainerProps)
  ]).isRequired,
  widgetStyling: PropTypes.shape(WidgetStylingProps),
  macroMap: PropTypes.objectOf(PropTypes.string)
};

export const PVWidgetExtraProps = {
  pvName: PropTypes.string.isRequired,
  wrappers: PropTypes.shape({
    copywrapper: PropTypes.bool,
    alarmborder: PropTypes.bool
  })
};

export const PVWidgetProperties = {
  pvName: PropTypes.string.isRequired,
  wrappers: PropTypes.shape({
    copywrapper: PropTypes.bool,
    alarmborder: PropTypes.bool
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
