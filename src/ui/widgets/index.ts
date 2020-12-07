import log from "loglevel";

export { ActionButton } from "./ActionButton/actionButton";
export { Checkbox } from "./Checkbox/checkbox";
export { Device } from "./Device/device";
export { Display } from "./Display/display";
export { DrawerWidget } from "./Drawer/drawer";
export { DropDown } from "./DropDown/dropDown";
export { DynamicPageWidget } from "./DynamicPage/dynamicPage";
export { DynamicTabs } from "./Tabs/dynamicTabs";
export { EmbeddedDisplay } from "./EmbeddedDisplay/embeddedDisplay";
export { FlexContainer } from "./FlexContainer/flexContainer";
export { GroupBox } from "./GroupBox/groupBox";
export { GroupingContainer } from "./GroupingContainer/groupingContainer";
export { Image } from "./Image/image";
export { Input } from "./Input/input";
export { Label } from "./Label/label";
export { LED } from "./LED/led";
export { MenuButton } from "./MenuButton/menuButton";
export { MenuMux } from "./MenuMux/menuMux";
export { ProgressBar } from "./ProgressBar/progressBar";
export { Line } from "./Line/line";
export { Readback } from "./Readback/readback";
export { Shape } from "./Shape/shape";
export { SlideControl } from "./SlideControl/slideControl";
export { Slideshow } from "./Slideshow/slideshow";
export { Symbol } from "./Symbol/symbol";
export { TabContainer } from "./Tabs/tabContainer";

// By importing and calling this function you ensure all the
// above widgets are imported and thus registered.
export function ensureWidgetsRegistered(): void {
  log.debug("Triggering widget import.");
}
