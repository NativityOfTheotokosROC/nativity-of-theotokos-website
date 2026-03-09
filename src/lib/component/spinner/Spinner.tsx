import { ModeledVoidComponent } from "@mvc-react/components";
import { SpinnerModel } from "../../model/spinner";
import { ClipLoader } from "react-spinners";

const Spinner = function ({ model }) {
	const { color, size } = model.modelView;

	return <ClipLoader color={color} size={size} />;
} satisfies ModeledVoidComponent<SpinnerModel>;

export default Spinner;
