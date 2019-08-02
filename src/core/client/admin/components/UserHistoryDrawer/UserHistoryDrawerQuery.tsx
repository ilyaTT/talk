import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { UserHistoryDrawerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerQuery.graphql";
import { UserStatusChangeContainer } from "coral-admin/components/UserStatus";
import { CopyButton } from "coral-framework/components";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  Flex,
  Icon,
  Spinner,
  Typography,
} from "coral-ui/components";

import Tabs from "./Tabs";

import styles from "./UserHistoryDrawerQuery.css";

interface Props {
  userID: string;
  onClose: () => void;
  firstFocusableRef: React.RefObject<any>;
  lastFocusableRef: React.RefObject<any>;
}

const UserHistoryDrawerQuery: FunctionComponent<Props> = ({
  userID,
  onClose,
}) => {
  const { locales } = useCoralContext();
  const formatter = new Intl.DateTimeFormat(locales, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryDrawerQuery($userID: ID!) {
          user(id: $userID) {
            id
            username
            email
            createdAt
            ...UserStatusChangeContainer_user
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }: ReadyState<QueryTypes["response"]>) => {
        if (!props) {
          return (
            <div className={styles.root}>
              <Spinner />
            </div>
          );
        }

        if (!props.user) {
          return (
            <div className={styles.callout}>
              <CallOut>
                <Localized id="moderate-user-drawer-user-not-found ">
                  User not found.
                </Localized>
              </CallOut>
            </div>
          );
        }

        const user = props.user;

        return (
          <>
            <Button className={styles.close} onClick={onClose}>
              <Icon size="md">close</Icon>
            </Button>
            <Flex className={styles.username}>
              <span>{user.username}</span>
            </Flex>
            <div className={styles.userStatus}>
              <div className={styles.userStatusLabel}>Status:</div>
              <div className={styles.userStatusChange}>
                <UserStatusChangeContainer user={user} />
              </div>
            </div>
            <div className={styles.userDetails}>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-email"
                  attrs={{ title: true }}
                >
                  <Icon size="sm" className={styles.icon} title="Email address">
                    mail_outline
                  </Icon>
                </Localized>
                <Typography
                  variant="bodyCopy"
                  container="span"
                  className={styles.userDetailValue}
                >
                  {user.email}
                </Typography>
                <CopyButton
                  text={user.email!}
                  variant="regular"
                  className={styles.copy}
                />
              </Flex>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-created-at"
                  attrs={{ title: true }}
                >
                  <Icon
                    size="sm"
                    className={styles.icon}
                    title="Account creation date"
                  >
                    date_range
                  </Icon>
                </Localized>
                <Typography variant="bodyCopy" container="span">
                  {formatter.format(new Date(user.createdAt))}
                </Typography>
              </Flex>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-member-id"
                  attrs={{ title: true }}
                >
                  <Icon size="sm" className={styles.icon} title="Member ID">
                    people_outline
                  </Icon>
                </Localized>
                <Typography
                  variant="bodyCopy"
                  container="span"
                  className={styles.userDetailValue}
                >
                  {user.id}
                </Typography>
                <CopyButton
                  text={user.id}
                  variant="regular"
                  className={styles.copy}
                />
              </Flex>
            </div>
            <hr className={styles.divider} />
            <div className={styles.comments}>
              <Tabs userID={user.id} />
            </div>
          </>
        );
      }}
    />
  );
};

export default UserHistoryDrawerQuery;