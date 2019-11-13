import { configure } from "enzyme";
import log from "loglevel";
import Adapter from "enzyme-adapter-react-16";
// tslint:disable-next-line:no-any
configure({ adapter: new Adapter() });

log.setLevel("INFO");
