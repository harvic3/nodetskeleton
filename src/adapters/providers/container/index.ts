import TextFeelingService from "../../../application/modules/feeling/serviceContracts/textFeeling/TextFeelingService";
import TextFeelingProvider from "../../providers/feeling/TextFeelingProvider";
import { HealthProvider } from "../health/HealthProvider";

const textFeelingProvider = new TextFeelingProvider();
const textFeelingService = new TextFeelingService(textFeelingProvider);

const healthProvider = new HealthProvider();

export { healthProvider, textFeelingService };
