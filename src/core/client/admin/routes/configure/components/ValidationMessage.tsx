import React, { StatelessComponent } from "react";

import { ValidationMessage as UIValidationMessage } from "talk-ui/components";

import { PropTypesOf } from "talk-ui/types";
import styles from "./ValidationMessage.css";

interface Props extends PropTypesOf<typeof UIValidationMessage> {
  children: React.ReactNode;
}

const ValidationMessage: StatelessComponent<Props> = ({
  children,
  ...rest
}) => (
  <UIValidationMessage {...rest} className={styles.root}>
    {children}
  </UIValidationMessage>
);

export default ValidationMessage;