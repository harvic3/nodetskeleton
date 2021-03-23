import TextFeelingService from "../../../application/modules/feeling/serviceContracts/textFeeling/TextFeelingService";
import TextFeelingProvider from "../../providers/feeling/TextFeelingProvider";
import { HealthProvider } from "../health/HealthProvider";
import { AuthProvider } from "../auth/AuthProvider";

const textFeelingProvider = new TextFeelingProvider();
const textFeelingService = new TextFeelingService(textFeelingProvider);
const authProvider = new AuthProvider();

const healthProvider = new HealthProvider();

export { healthProvider, authProvider, textFeelingService };
