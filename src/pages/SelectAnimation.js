import PatternButton from "./components/PatternButton";

import useServerCommunication from "../serverCommunication";

function SelectAnimation(props) {
    const { postAninmationRequest, postTurnOffRequest } =
        useServerCommunication();

    return (
        <div className="SelectPattern">
            Select the animation you'd like to see.
            <div>
                <div>
                    <PatternButton
                        buttonText="Rainbow Cycle"
                        onClick={() => {
                            console.log(props);
                            postAninmationRequest(
                                "rainbowCycle",
                                props.currentDevice
                            );
                        }}
                    />
                </div>
                <div>
                    <PatternButton
                        buttonText="Slow Random Transition"
                        onClick={() =>
                            postAninmationRequest(
                                "slowRandomTransition",
                                props.currentDevice
                            )
                        }
                    />
                </div>
                <div>
                    <PatternButton
                        buttonText="Fast Random Transition"
                        onClick={() =>
                            postAninmationRequest(
                                "fastRandomTransition",
                                props.currentDevice
                            )
                        }
                    />
                </div>
                <div>
                    <PatternButton
                        buttonText="Turn Off"
                        onClick={() => postTurnOffRequest(props.currentDevice)}
                    />
                </div>
            </div>
        </div>
    );
}

export default SelectAnimation;
