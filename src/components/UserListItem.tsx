import { Image, View } from "react-native";
import { Text } from ".";
import { useTw } from "../theme";
import { GitHubUser } from "../types";

export interface UserListItemProps {
  user: GitHubUser;
}

/**
 * A simple component that shows a GitHub user
 * as a list row
 * @param user the GitHub user to be shown
 */
export function UserListItem({ user }: UserListItemProps) {
  const tw = useTw();
  return (
    <View
      style={tw`flex flex-row items-center py-sm border-b-[1px] border-grey`}
    >
      <Image
        source={{ uri: user.avatar_url }}
        style={tw`h-[36px] w-[36px] rounded-sm`}
      />
      <Text style={tw`pl-md`}>{user.login}</Text>
    </View>
  );
}
