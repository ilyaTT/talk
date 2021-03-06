import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React from "react";

import BaseButton from "coral-ui/components/v2/BaseButton";
import { withStyles } from "coral-ui/hocs";

import styles from "./Tab.css";

export interface TabProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * The id/name of the tab
   */
  tabID: string;
  /**
   * Active status
   */
  active?: boolean;
  /**
   * Style variant
   */
  variant?:
    | "primary"
    | "secondary"
    | "default"
    | "streamSecondary"
    | "streamPrimary";
  /**
   * Action taken on tab click
   */
  onTabClick?: (tabID: string) => void;

  uppercase?: boolean;

  ariaLabel?: string;
  localizationId?: string;
}

class Tab extends React.Component<TabProps> {
  public handleTabClick = () => {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabID);
    }
  };

  public render() {
    const {
      className,
      classes,
      children,
      tabID,
      active,
      variant,
      uppercase,
      ariaLabel,
      localizationId,
    } = this.props;

    const buttonClassName = cn(
      classes.button,
      {
        [classes.primary]: variant === "primary",
        [classes.secondary]: variant === "secondary",
        [classes.streamSecondary]: variant === "streamSecondary",
        [classes.streamPrimary]: variant === "streamPrimary",
        [classes.default]: variant === "default",
        [classes.uppercase]: uppercase,
        [classes.active]: active,
      },
      className
    );

    return (
      <li
        className={classes.root}
        key={tabID}
        id={`tab-${tabID}`}
        role="presentation"
      >
        {localizationId ? (
          <Localized
            id={localizationId}
            attrs={{ "aria-label": true, title: true }}
          >
            <BaseButton
              className={buttonClassName}
              aria-controls={`tabPane-${tabID}`}
              role="tab"
              aria-selected={active}
              onClick={this.handleTabClick}
            >
              {children}
            </BaseButton>
          </Localized>
        ) : (
          <BaseButton
            className={buttonClassName}
            aria-controls={`tabPane-${tabID}`}
            role="tab"
            aria-selected={active}
            aria-label={ariaLabel}
            onClick={this.handleTabClick}
          >
            {children}
          </BaseButton>
        )}
      </li>
    );
  }
}

const enhanced = withStyles(styles)(Tab);
export default enhanced;
