import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

log.setLevel("info");
