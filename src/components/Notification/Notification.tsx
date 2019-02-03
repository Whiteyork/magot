import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button';
import Icon, { IconProps } from '../Icon';
import * as component from '../component';
import { useCreated } from '../../hooks/created';
import { useTimingToggle } from '../../hooks/timer';
import { useAnimation } from '../../hooks/animation';
import { useVisibility } from '../../hooks/visibility';

import './Notification.less';

export interface NotificationProps extends component.BaseComponent {
  /**
   * 通知提醒框标题文案
   */
  title: string | React.ReactNode;

  /**
   * 通知提醒框消息文案
   */
  message: string | React.ReactNode;

  container?: Element | null;

  /**
   * 自定义图标
   */
  icon?: string | React.ReactElement<IconProps>;

  /**
   * 是否显示关闭按钮
   * @default true
   */
  closable?: boolean;

  /**
   * 显示时长，当时间到了之后会自动关闭，如果设置为0，则不会自动关闭。单位毫秒，默认4.5秒。
   * @default 4500
   */
  duration?: number;

  /**
   * 关闭时的回调函数
   */
  onClose?: () => void;
}

type FullNotificationProps = NotificationProps & { type?: string };

const defaultProps: Partial<NotificationProps> = {
  closable: true,
  duration: 4500,
};

function Notification(props: FullNotificationProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const internallyRef = React.useRef(false);

  const created = useCreated(modalRef);
  const [visibility, setVisibility] = useVisibility(
    true,
    internallyRef.current
  );

  const close = () => {
    if (!visibility) return;
    internallyRef.current = true;
    setVisibility(false);
  };

  const timingEnd = useTimingToggle(false, props.duration, !visibility);
  if (timingEnd) close();

  const handleAnimationEnd = () => {
    if (!visibility) {
      props.onClose && props.onClose();
    }
  };
  const animation = useAnimation(visibility, modalRef, handleAnimationEnd);
  const hidden = animation === null && !visibility;
  if (hidden) internallyRef.current = false;

  if ((!visibility && !created) || hidden) return null;

  const type = 'notification';
  const prefix = component.getComponentPrefix(type);
  const cls = component.getComponentClasses(type, props, {
    [`${prefix}-${props.type}`]: !!props.type,
    [`${prefix}-${animation}`]: !!animation,
  });

  return ReactDOM.createPortal(
    <div ref={modalRef} className={cls} style={props.style}>
      <div className={prefix + '-title'}>
        <NotificationIcon icon={props.icon} />
        <span className="text">{props.title}</span>
      </div>
      <div className={prefix + '-message'}>{props.message}</div>
      {props.closable && <Button icon="close" square={true} onClick={close} />}
    </div>,
    props.container || document.body
  );
}

Notification.defaultProps = defaultProps;

function NotificationIcon(props: Pick<NotificationProps, 'icon'>) {
  if (typeof props.icon === 'string') {
    return <Icon name={props.icon} />;
  }
  return props.icon || null;
}

function createNotificationRoot() {
  const prefix = component.getComponentPrefix('notification');
  const cls = prefix + '-root';
  let root = document.body.querySelector('.' + cls);
  if (root === null) {
    root = document.createElement('div');
    root.className = cls;
    document.body.appendChild(root);
  }
  return root;
}

function createNotification(props: FullNotificationProps) {
  const root = createNotificationRoot();
  const div = document.createElement('div');
  return ReactDOM.render(<Notification {...props} container={root} />, div);
}

Notification.open = function open(props: NotificationProps) {
  return createNotification({ ...defaultProps, ...props });
};

Notification.info = function info(props: NotificationProps) {
  return createNotification({
    ...defaultProps,
    icon: 'info',
    ...props,
    type: 'info',
  });
};

Notification.success = function success(props: NotificationProps) {
  return createNotification({
    ...defaultProps,
    icon: 'success',
    ...props,
    type: 'success',
  });
};

Notification.error = function error(props: NotificationProps) {
  return createNotification({
    ...defaultProps,
    icon: 'error',
    ...props,
    type: 'error',
  });
};

Notification.warning = function warning(props: NotificationProps) {
  return createNotification({
    ...defaultProps,
    icon: 'info',
    ...props,
    type: 'warning',
  });
};

export default Notification;
